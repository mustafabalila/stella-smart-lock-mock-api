/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
	return knex.schema.createTable('access_code', table => {
		table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('reservation_id').notNullable().references('id').inTable('reservation');
		table.uuid('lock_id').notNullable().references('id').inTable('lock');
		table.text('remote_passcode_id').notNullable();
		table.text('passcode').notNullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('access_code');
};
