const fastifyPlugin = require('fastify-plugin');

async function rateLimiter(fastify, options) {
	await fastify.register(require('@fastify/rate-limit'), {
		cache: 10000,
		whitelist: ['127.0.0.1', 'localhost'],
		skipOnError: true,
		redis: fastify.cache,
	});
}

module.exports = fastifyPlugin(rateLimiter, {
	name: 'rateLimiting',
	dependencies: ['config', 'cache'],
});
