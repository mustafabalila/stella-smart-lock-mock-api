const BaseModel = require('./Base');

module.exports = class Reservation extends BaseModel {
	static get tableName() {
		return 'Reservation';
	}

	static get jsonSchema() {
		return {
			type: 'object',
			required: ['unitId', 'guestName', 'checkIn', 'checkOut', 'isCancelled'],

			properties: {
				id: { type: 'string', format: 'uuid' },
				unitId: { type: 'string', format: 'uuid' },
				guestName: { type: 'string' },
				checkIn: { type: 'string', format: 'date-time' },
				checkOut: { type: 'string', format: 'date-time' },
        isCancelled: { type: 'boolean', default: false },
				createdAt: { type: 'string', format: 'date-time' },
				updatedAt: { type: 'string', format: 'date-time' },
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
					from: 'Reservation.unitId',
					to: 'Unit.id',
				},
			},
		};
	}
};
