const BaseModel = require('./Base');

module.exports = class Unit extends BaseModel {
	static get tableName() {
		return 'Unit';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['unitName'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				unitName: { type: 'string' },
				createdAt: { type: 'string', format: 'date-time' },
				updatedAt: { type: 'string', format: 'date-time' },
			},
		};
	}

	static get relationMappings() {
		return {};
	}
};
