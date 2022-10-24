const { bootstrap } = require('../server');

describe('server', function() {
	let server = null;
	beforeAll(async function() {
		server = await bootstrap();
		server.ready().catch(err => {
			server.log.error(err);
		});
	});

	test('registers config plugin', async function() {
		expect(server.config).toBeTruthy();
	});

	test('registers db plugin', async function() {
		expect(server.models).toBeTruthy();
		expect(server.knex).toBeTruthy();
	});

	test('registers cache plugin', async function() {
		expect(server.cache).toBeTruthy();
	});

	test('registers tuya plugin', async function() {
		expect(server.tuya).toBeTruthy();
	});

	test('register graphql plugin', async function() {
		expect(server.graphql).toBeTruthy();
	});
});
