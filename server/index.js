const fastify = require('fastify');
const path = require('path');
const { SERVER_CONFIG } = require('./config/server');
const ajv = require('./config/ajv');

/**
 * Bootstraps the API service
 * @returns {Promise<import('fastify').FastifyInstance>}
 */
async function bootstrap() {
	// Initialize the server
	const server = fastify(SERVER_CONFIG);

	// Use a custom schema validator
	server.setValidatorCompiler(function ({ schema }) {
		return ajv.compile(schema);
	});

	// Standardize HTTP error responses
	await server.register(require('@fastify/sensible'));

	// Load environment variables and configuration options
	await server.register(require('./plugins/config'));

	// Sane default HTTP headers
	await server.register(require('@fastify/helmet'), {
		contentSecurityPolicy: false,
	});
	await server.register(require('@fastify/cors'));

	// Load DB client and initialize models
	await server.register(require('./plugins/db'));

	// // Load Cache client
	await server.register(require('./plugins/cache'));

	// Enable static file serving
	await server.register(require('@fastify/static'), {
		root: path.join(__dirname, 'static'),
	});

	// Enable healthchecks
	await server.register(require('./plugins/underPressure'));

	// Enable rate-limiter
	await server.register(require('./plugins/rateLimiting'));

	// Include tuya functionality
	await server.register(require('./plugins/tuya'));

	// Enable GraphQL
	await server.register(require('./plugins/graphql'));


	// Register application routes
	await server.register(require('./routes'), { prefix: 'api' });

	return server;
}

module.exports = { bootstrap };
