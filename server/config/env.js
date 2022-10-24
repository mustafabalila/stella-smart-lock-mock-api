const ENV_SCHEMA = {
	type: 'object',
	required: [
		'SERVICE_NAME',
		'DATABASE_URL',
		'REDIS_URL',
		'TUYA_API_KEY',
		'TUYA_API_SECRET',
	],

	properties: {
		SERVICE_NAME: {
			type: 'string',
		},
		HOST: {
			type: 'string',
			default: '0.0.0.0',
		},
		PORT: {
			type: 'number',
			default: 3000,
		},
		APP_ENV: {
			type: 'string',
			enum: ['development', 'staging', 'testing', 'production'],
			default: 'development',
		},
		NODE_ENV: {
			type: 'string',
			enum: ['development', 'staging', 'testing', 'production'],
			default: 'development',
		},
		LOG_LEVEL: {
			type: 'string',
			enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
			default: 'info',
		},
		DISABLE_LOGGING: {
			type: 'boolean',
			default: false,
		},
		DATABASE_URL: {
			type: 'string',
		},
		REDIS_URL: {
			type: 'string',
		},
		TUYA_API_KEY: {
			type: 'string',
		},
		TUYA_API_SECRET: {
			type: 'string',
		},
	},
};

module.exports = { ENV_SCHEMA };
