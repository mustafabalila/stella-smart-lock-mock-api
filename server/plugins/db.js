const fastifyPlugin = require('fastify-plugin');
const Knex = require('knex');
const { Model, knexSnakeCaseMappers } = require('objection');
const { parse } = require('pg-connection-string');

async function db(fastify, options) {
	const connection = parse(fastify.config.DATABASE_URL);
	connection.ssl = false;
	const knex = Knex({
		...options,
		client: 'pg',
		connection,
		searchPath: ['api', 'public'],
		pool: {
			min: 2,
			max: 10,
		},
		debug: fastify.config.LOG_LEVEL === 'debug',
		log: {
			warn(message) {
				fastify.log.warn(message);
			},
			error(message) {
				fastify.log.error(message);
			},
			deprecate(message) {
				fastify.log.deprecate(message);
			},
			debug(message) {
				fastify.log.debug(message);
			},
			enableColors: fastify.config.NODE_ENV === 'development',
		},
		// Map DB snake_case identifiers to camelCase
		...knexSnakeCaseMappers(),
	});
	fastify.decorate('knex', knex);

	// Provide ObjectionJS with knex DB client & initialize the models
	Model.knex(knex);
	fastify.decorate('models', require('../models'));
}

module.exports = fastifyPlugin(db, {
	name: 'db',
	dependencies: ['config'],
});
