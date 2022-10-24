const crypto = require('crypto');
const fastifyPlugin = require('fastify-plugin');
const fetch = require('node-fetch-retry');
const { async: asyncCryptoRandomString } = require('crypto-random-string');

function getTime() {
	var timestamp = new Date().getTime();
	return timestamp;
}

function calcSign(clientId, secret, timestamp) {
	const str = clientId + timestamp;
	const hash = crypto
		.createHmac('sha256', str)
		.update(secret)
		.digest('base64');
	const signUp = hash.toUpperCase();
	return signUp;
}

async function tuya(fastify, options) {
	const baseUrl = 'https://openapi.tuyacn.com';

	const clientId = fastify.config.TUYA_API_KEY;
	const secret = fastify.config.TUYA_API_SECRET;

	/**
	 * The complete Tuya access token response object.
	 * @typedef {Object} TuyaAccessTokenResponse
	 * @property {string} access_token - Access token
	 * @property {string} refresh_token - Refresh token.
	 * @property {number} expire - Expire time in seconds.
	 */

	/**
	 *
	 * @param {string} refreshToken
	 * @returns {Promise<TuyaAccessTokenResponse>}
	 */
	const refreshTuyaToken = async refreshToken => {
		const url = `${baseUrl}/v1.0/token/${refreshToken}`;
		const timestamp = getTime();
		const sign = calcSign(clientId, secret, timestamp);
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				client_id: clientId,
				sign: sign,
				sign_method: 'HMAC-SHA256',
				t: timestamp,
			},
		});
		const data = await response.json();
		if (data.success) {
			return data.result;
		}
		fastify.log.error(data);
		return { error: true };
	};

	/**
	 * Get API access token.
	 * @returns {Promise<TuyaAccessTokenResponse>}
	 */
	const getTuyaToken = async () => {
		const url = `${baseUrl}/v1.0/token?grant_type=1`;
		const timestamp = getTime();
		const sign = calcSign(clientId, secret, timestamp);
		const response = await fetch(url, {
			retry: 3,
			method: 'GET',
			headers: {
				client_id: clientId,
				sign: sign,
				sign_method: 'HMAC-SHA256',
				t: timestamp,
			},
		});

		const data = await response.json();
		if (data.success) {
			return data.result;
		}
		fastify.log.error(data);
		return { error: true };
	};

	const getAccessToken = async () => {
		// check if token is present in cache
		const tokenFromCache = await fastify.cache.get('tuya:token');
		if (tokenFromCache) {
			return tokenFromCache;
		}
		// check if token is present in db
		const tokenFromDb = await fastify.models.TuyaToken.query().findOne({});
		if (tokenFromDb) {
			// check if token is expired
			const now = new Date();
			const tokenExpiry = new Date(tokenFromDb.expiresAt);
			if (now < tokenExpiry) {
				// token is not expired, set it in cache and return it
				await fastify.cache.set('tuya:token', tokenFromDb.accessToken);
				return tokenFromDb.accessToken;
			}
			// token is expired, use refresh token to get new token
			const refreshToken = tokenFromDb.refreshToken;
			const newToken = await refreshTuyaToken(refreshToken);
			// update token in db
			await fastify.models.TuyaToken.query()
				.findOne({ refreshToken })
				.patch({
					accessToken: newToken.access_token,
					refreshToken: newToken.refresh_token,
					expiresAt: new Date(new Date().getTime() + newToken.expire * 1000),
				});

			// set new token in cache and set its expiry to the token expiry time
			await fastify.cache.set(
				'tuya:token',
				newToken.access_token,
				'EX',
				newToken.expire,
			);
			return newToken.access_token;
		}
		// token is not present in db, get it from tuya
		const newToken = await getTuyaToken();
		// save token in db
		await fastify.models.TuyaToken.query().insert({
			accessToken: newToken.access_token,
			refreshToken: newToken.refresh_token,
			expiresAt: new Date(new Date().getTime() + newToken.expire * 1000),
		});
		// set new token in cache and set its expiry to the token expiry time
		await fastify.cache.set(
			'tuya:token',
			newToken.access_token,
			'EX',
			newToken.expire,
		);
		return newToken.access_token;
	};

	const getDeviceInfo = async deviceId => {
		const url = `${baseUrl}/v1.0/devices/${deviceId}`;
		const timestamp = getTime();
		const accessToken = await getAccessToken();
		const sign = calcSign(clientId, secret, timestamp);
		const response = await fetch(url, {
			retry: 3,
			method: 'GET',
			headers: {
				client_id: clientId,
				sign: sign,
				sign_method: 'HMAC-SHA256',
				t: timestamp,
				access_token: accessToken,
			},
		});
		const data = await response.json();
		if (data.success) {
			return data.result;
		}
		fastify.log.error(data);
		return { error: true };
	};

	const createPasswordTicket = async deviceId => {
		const url = `${baseUrl}/v1.0/devices/${deviceId}/password-ticket`;
		const timestamp = getTime();
		const accessToken = await getAccessToken();
		const sign = calcSign(clientId, secret, timestamp);
		const response = await fetch(url, {
			retry: 3,
			method: 'POST',
			headers: {
				client_id: clientId,
				sign: sign,
				sign_method: 'HMAC-SHA256',
				t: timestamp,
				access_token: accessToken,
			},
		});
		const data = await response.json();
		if (data.success) {
			return data.result;
		}
		fastify.log.error(data);
		return { error: true };
	};

	const encryptPasscode = (passcode, key) => {
		const cipher = crypto.createCipheriv('aes-128-ecb', key, '');
		cipher.setAutoPadding(true); // adds PKCS7Padding
		let crypted = cipher.update(passcode, 'utf8', 'hex');
		crypted += cipher.final('hex');
		return crypted;
	};

	// exposed functions
	const createAccessCode = async ({ deviceId, checkIn, checkOut }) => {
		const url = `${baseUrl}/v1.0/${deviceId}/door-lock/temp-password`;
		const timestamp = getTime();
		const accessToken = await getAccessToken();
		const sign = calcSign(clientId, secret, timestamp);

		const ticket = await createPasswordTicket(deviceId);
		// Generate a cryptographically strong random string
		// Math.random() is not cryptographically strong
		const sixDigitCode = await asyncCryptoRandomString({
			length: 6,
			type: 'numeric',
		});
		const deviceInfo = await getDeviceInfo(deviceId);
		const passcode = encryptPasscode(sixDigitCode, deviceInfo.local_key);

		const response = await fetch(url, {
			retry: 3,
			method: 'POST',
			headers: {
				client_id: clientId,
				sign: sign,
				sign_method: 'HMAC-SHA256',
				t: timestamp,
				access_token: accessToken,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				device_id: deviceId,
				name: `door lock for ${deviceId}`,
				password: passcode,
				effective_time: checkIn,
				invalid_time: checkOut,
				password_type: 'ticket',
				ticket_id: ticket.ticket_id,
				type: 0,
			}),
		});
		const data = await response.json();
		if (data.success) {
			return { ...data.result, passcode: sixDigitCode };
		}
		fastify.log.error(data);
		return { error: true };
	};

	const modifyAccessCode = async ({
		deviceId,
		accessCodeId,
		passcode,
		checkIn,
		checkOut,
	}) => {
		const url = `${baseUrl}/v1.0/${deviceId}/door-lock/temp-password/${accessCodeId}`;
		const timestamp = getTime();
		const accessToken = await getAccessToken();
		const sign = calcSign(clientId, secret, timestamp);

		const deviceInfo = await getDeviceInfo(deviceId);
		const password = encryptPasscode(passcode, deviceInfo.local_key);

		const response = await fetch(url, {
			retry: 3,
			method: 'PUT',
			headers: {
				client_id: clientId,
				sign: sign,
				sign_method: 'HMAC-SHA256',
				t: timestamp,
				access_token: accessToken,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				device_id: deviceId,
				password_id: accessCodeId,
				name: `door lock for ${deviceId}`,
				password,
				effective_time: checkIn,
				invalid_time: checkOut,
				password_type: 'ticket',
				type: 0,
			}),
		});
		const data = await response.json();
		if (data.success) {
			return data.result;
		}
		fastify.log.error(data);
		return { error: true };
	};

	const deleteAccessCode = async ({ deviceId, accessCodeId }) => {
		const url = `${baseUrl}/v1.0/${deviceId}/door-lock/temp-password/${accessCodeId}`;
		const timestamp = getTime();
		const accessToken = await getAccessToken();
		const sign = calcSign(clientId, secret, timestamp);

		const response = await fetch(url, {
			retry: 3,
			method: 'DELETE',
			headers: {
				client_id: clientId,
				sign: sign,
				sign_method: 'HMAC-SHA256',
				t: timestamp,
				access_token: accessToken,
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		if (data.success) {
			return data.result;
		}
		fastify.log.error(data);
		return { error: true };
	};

	fastify.decorate('tuya', {
		createAccessCode,
		modifyAccessCode,
		deleteAccessCode,
	});
}

module.exports = fastifyPlugin(tuya, {
	name: 'tuya',
	dependencies: ['config', 'db', 'cache'],
});
