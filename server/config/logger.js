const {
	LOG_LEVEL = 'info',
	DISABLE_LOGGING = false,
	SERVICE_NAME,
} = process.env;

const PINO_LEVEL_TO_GCP_SEVERITY = {
	trace: 'DEBUG',
	debug: 'DEBUG',
	info: 'INFO',
	warn: 'WARNING',
	error: 'ERROR',
	fatal: 'CRITICAL',
};

const PINO_CONFIG = {
	name: SERVICE_NAME,
	level: LOG_LEVEL,
	timestamp: true,
	formatters: {
		level: (label, number) => ({
			level: number,
			severity:
				PINO_LEVEL_TO_GCP_SEVERITY[String(label)] ||
				PINO_LEVEL_TO_GCP_SEVERITY['info'],
		}),
	},
};

module.exports = { PINO_CONFIG };
