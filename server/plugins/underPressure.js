const fastifyPlugin = require('fastify-plugin');

async function underPressure(fastify, options) {
	await fastify.register(require('@fastify/under-pressure'), {
		exposeStatusRoute: {
			routeOpts: {
				logLevel: fastify.config.LOG_LEVEL,
			},
			url: '/',
		},
		healthCheck: async function (fastifyInstance) {
			try {
				const dbIsAlive = await fastifyInstance.knex.raw(
					'select 1+1 as result',
				);

				await fastifyInstance.cache.set('connection_test', 'true', 'EX', 3);
				const cacheIsAlive = await fastifyInstance.cache.get('connection_test');
				if (dbIsAlive && cacheIsAlive) {
					return true;
				}

				return false;
			} catch (error) {
				fastify.log.error(error);

				return false;
			}
		},
		healthCheckInterval: 5000, // Every 5 seconds
	});
}

module.exports = fastifyPlugin(underPressure, {
	name: 'underPressure',
	dependencies: ['config', 'db', 'cache'],
});
