/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
	// Deletes ALL existing entries
	await knex('api.lock').del();
	await knex('api.lock').insert([
		{
			id: knex.raw('uuid_generate_v4()'),
			unit_id: '52765b2c-c0bd-4b65-8a70-949a879a3994',
			remote_device_id: '8874604198cdac02b162',
		},
	]);
};
