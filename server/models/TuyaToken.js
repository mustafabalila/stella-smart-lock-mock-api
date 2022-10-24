const BaseModel = require('./Base');

module.exports = class TuyaToken extends BaseModel {
	static get tableName() {
		return 'TuyaToken';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['accessToken', 'refreshToken', 'expiresAt'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				accessToken: { type: 'string' },
				refreshToken: { type: 'string' },
				expiresAt: { type: 'string', format: 'date-time' },
				createdAt: { type: 'string', format: 'date-time' },
				updatedAt: { type: 'string', format: 'date-time' },
			},
		};
	}

	static get relationMappings() {
		return {};
	}
};
