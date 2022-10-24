const BaseModel = require('./Base');

module.exports = class AccessCode extends BaseModel {
	static get tableName() {
		return 'AccessCode';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['lockId', 'reservationId', 'passcode', 'remotePasscodeId'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				lockId: { type: 'string', format: 'uuid' },
				reservationId: { type: 'string', format: 'uuid' },
				passcode: { type: 'string' },
				remotePasscodeId: { type: 'string' },
			},
		};
	}

	static get relationMappings() {
		const Unit = require('./Unit');

		return {
			unit: {
				relation: BaseModel.BelongsToOneRelation,
				modelClass: Unit,
				join: {
					from: 'Lock.unitId',
					to: 'Unit.id',
				},
			},
		};
	}
};
