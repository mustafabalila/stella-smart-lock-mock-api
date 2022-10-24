const Ajv = require('ajv').default;
const ajvErrors = require('ajv-errors');
const ajvFormats = require('ajv-formats');

const ajv = new Ajv({
	allErrors: true,
	removeAdditional: true,
	useDefaults: true,
	coerceTypes: true,
});

ajvFormats(ajv);
ajvErrors(ajv);

module.exports = ajv;
