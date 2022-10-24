const fastifyPlugin = require('fastify-plugin');
const schema = require('../graphql');

async function graphql(fastify, options) {
	await fastify.register(require('mercurius'), {
		schema,
		federationMetadata: false,
		route: true,
		path: '/graphql',
		graphiql: true,
		jit: 3,
		queryDepth: 7,
		context: async function (request, reply) {
			return {
				request,
				reply,
				logger: fastify.log,
				models: fastify.models,
				cache: fastify.cache,
        tuya: fastify.tuya,
			};
		},
	});

}

module.exports = fastifyPlugin(graphql, {
	name: 'graphql',
	dependencies: ['config', 'db', 'cache', 'tuya'],
});
