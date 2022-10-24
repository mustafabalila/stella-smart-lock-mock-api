/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('reservation', table => {
		table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
		table.uuid('unit_id').notNullable().references('id').inTable('unit');
		table.text('guest_name').notNullable();
		table.timestamp('check_in').notNullable();
		table.timestamp('check_out').notNullable();
		table.boolean('is_cancelled').defaultTo(false);
		table.timestamps(true, true);
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('reservation');
};
