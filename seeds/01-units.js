/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.seed = async function(knex) {
	// Deletes ALL existing entries
	await knex('api.unit').del();
	await knex('api.unit').insert([
		{ id: '52765b2c-c0bd-4b65-8a70-949a879a3994', unit_name: 'Building 1' },
		{ id: knex.raw('uuid_generate_v4()'), unit_name: 'Building 2' },
		{ id: knex.raw('uuid_generate_v4()'), unit_name: 'Building 3' },
	]);
};
