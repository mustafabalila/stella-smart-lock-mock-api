/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
	return knex.schema.createTable('tuya_token', table => {
		table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('access_token').notNullable()
    table.text('refresh_token').notNullable()
    table.timestamp('expires_at').notNullable()
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('tuya_token');
};
