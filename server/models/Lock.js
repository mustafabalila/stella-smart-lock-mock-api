const BaseModel = require('./Base');

module.exports = class Lock extends BaseModel {
	static get tableName() {
		return 'Lock';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['unitId', 'remoteDeviceId'],

			properties: {
				id: { type: 'string' },
				unitId: { type: 'string', format: 'uuid' },
				remoteDeviceId: { type: 'string' },
				createdAt: { type: 'string', format: 'date-time' },
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
