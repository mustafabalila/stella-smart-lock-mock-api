const { bootstrap } = require('../../server');

describe('under-pressure plugin', function() {
	let server = null;
	beforeAll(async function() {
		server = await bootstrap();
		server.ready().catch(err => {
			server.log.error(err);
		});
	});

	test('displays correct healthcheck response', async function() {
		const aliveResponse = await server.inject({
			method: 'GET',
			path: '/api/v1/healthz',
		});

		expect(aliveResponse.json()).toStrictEqual({
			status: 'ok',
		});
	});
});
