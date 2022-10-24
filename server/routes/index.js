module.exports = async function registerRoutes(fastify, options) {
	await fastify.register(require('./v1'), { prefix: 'v1' }); // /v1
};
