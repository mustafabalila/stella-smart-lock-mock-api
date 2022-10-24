const fastifyPlugin = require('fastify-plugin');
const IORedis = require('ioredis');
const redisUrlParse = require('redis-url-parse');

async function cache(fastify, options) {
	const { host, port, database, password } = redisUrlParse(
		fastify.config.REDIS_URL,
	);
	const cache = new IORedis({
		host,
		port,
		password,
		db: database,
		tls: fastify.config.REDIS_URL.startsWith('rediss')
			? {
					rejectUnauthorized: false,
					requestCert: true,
					agent: false,
			  }
			: null,
		reconnectOnError: err => {
			fastify.log.error('Reconnect on error', err);

			const targetError = 'READONLY';

			if (err.message.slice(0, targetError.length) === targetError) {
				// Only reconnect when the error starts with "READONLY"
				return true;
			}

			return false;
		},

		retryStrategy: times => {
			fastify.log.error(`Retrying to connect....${times}`);

			// Stop retrying after 6 times
			if (times >= 6) {
				return undefined;
			}

			return Math.min(times * 50, 2000);
		},
	});

	fastify.decorate('cache', cache);
}

module.exports = fastifyPlugin(cache, {
	name: 'cache',
	dependencies: ['config'],
});
