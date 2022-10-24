const models = require('require-all')({
	dirname: __dirname,
	filter: filename => {
		const result = /^(.+)\.js$/.exec(filename);
		if (result && result[1] !== 'index' && result !== 'Base') {
			return result[1].replace(/_([a-z])/g, (m, c) => c.toUpperCase());
		}

		return false;
	},
});

module.exports = models;
