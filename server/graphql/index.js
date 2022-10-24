const { makeExecutableSchema } = require('@graphql-tools/schema');

module.exports = makeExecutableSchema({
	typeDefs: require('./schema'),
	resolvers: require('./resolvers'),
});
