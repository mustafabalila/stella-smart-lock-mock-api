/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
	return knex.schema.createTable('lock', table => {
		table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('unit_id').notNullable().references('id').inTable('unit');
		table.text('remote_device_id').notNullable();
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('lock');
};
