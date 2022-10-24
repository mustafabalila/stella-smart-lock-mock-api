const { Model, AjvValidator, mixin, ValidationError } = require('objection');
const { DBErrors } = require('objection-db-errors');
const addFormats = require('ajv-formats');

module.exports = class BaseModel extends mixin(Model, [DBErrors]) {
	/**
	 * Defines the lookup paths for models references in 'relationMappings'
	 */
	static get modelPaths() {
		return [__dirname];
	}

	static createValidator() {
		return new AjvValidator({
			onCreateAjv: ajv => {
				addFormats(ajv);
			},
			options: {
				allErrors: true,
				validateSchema: true,
				ownProperties: true,
				removeAdditional: 'all',
			},
		});
	}

	$beforeValidate(jsonSchema, json) {
		// Converts Javascript Date objects into their corresponding ISO Strings
		Object.entries(jsonSchema.properties).forEach(([prop, schema]) => {
			if (['date', 'date-time'].includes(schema.format)) {
				if (
					typeof json[`${prop}`] === 'object' &&
					json[`${prop}`] instanceof Date
				) {
					json[`${prop}`] = json[`${prop}`].toISOString();
				} else if (typeof json[`${prop}`] === 'number') {
					json[`${prop}`] = new Date(json[`${prop}`]).toISOString();
				}
			}
		});

		return jsonSchema;
	}

	$beforeInsert() {
		if (this.id) {
			throw new ValidationError({
				message: `Identifier should not be defined before insert: ${this.tableName}.${this.id}`,
				type: 'InvalidInsertWithId',
			});
		}
	}

	$parseDatabaseJson(json) {
		json = super.$parseDatabaseJson(json);

		// Converts ISO8601 strings into Javascript Date objects
		Object.entries(this.constructor.jsonSchema.properties).forEach(
			([prop, schema]) => {
				if (['date-time', 'date'].includes(schema.format)) {
					json[`${prop}`] = json[`${prop}`] && new Date(json[`${prop}`]);
				}
			},
		);

		return json;
	}
};
