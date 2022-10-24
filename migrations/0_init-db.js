/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema
		.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public')
		.raw('CREATE SCHEMA IF NOT EXISTS api;')
    .raw('set search_path = api,public')
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
