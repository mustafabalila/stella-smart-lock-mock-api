const fastifyPlugin = require('fastify-plugin');
const { ENV_SCHEMA } = require('../config/env');

async function config(fastify) {
	// Load environment variables according to schema
	await fastify.register(require('@fastify/env'), {
		schema: ENV_SCHEMA,
		confKey: 'env',
	});

	// Add config to server context
	fastify.decorate('config', {
		...fastify.env,
		...require('../config/server'),
	});
}

module.exports = fastifyPlugin(config, {
	name: 'config',
});
