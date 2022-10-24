const { v4: uuid } = require('uuid');
const { PINO_CONFIG } = require('./logger');
const qs = require('qs');

function genReqId(req) {
  return req.headers['x-request-id'] || uuid();
}

const SERVER_CONFIG = {
	trustProxy: true,
	logger: PINO_CONFIG,
	ignoreTrailingSlash: true,
	genReqId,
	querystringParser: str =>
		qs.parse(str, {
			allowPrototypes: false,
			charset: 'utf-8',
			charsetSentinel: true,
			parseArrays: false,
			interpretNumericEntities: true,
			parameterLimit: 5,
			strictNullHandling: true,
			plainObjects: false,
		}),
};

module.exports = { SERVER_CONFIG };
