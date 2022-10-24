// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
	client: 'pg',
	connection: process.env.DATABASE_URL,
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		tableName: 'knex_migrations',
		schemaName: 'api',
	},
};
