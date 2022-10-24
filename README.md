# Stella Smart Lock API

## Important Docs

- [Fastify](https://fastify.io/)
  - [Encapsulation](https://www.fastify.io/docs/latest/Encapsulation/)
  - [Routes](https://www.fastify.io/docs/latest/Routes/)
  - [Plugins](https://www.fastify.io/docs/latest/Plugins/)
  - [Logging](https://www.fastify.io/docs/latest/Logging/)
  - [Validation & Serialization](https://www.fastify.io/docs/latest/Validation-and-Serialization/)
  - [Hooks](https://www.fastify.io/docs/latest/Hooks/)
- [Objection.js](https://vincit.github.io/objection.js/)
  - [Models](https://vincit.github.io/objection.js/api/model/)
  - [Transactions](https://vincit.github.io/objection.js/guide/transactions.html)
  - [Find Methods](https://vincit.github.io/objection.js/api/query-builder/find-methods.html): `.where(...), .findById(id), .findOne(...)`
  - [Mutating Methods](https://vincit.github.io/objection.js/api/query-builder/mutate-methods.html): `.insert(...), .insertAndFetch(...), .patch(...), .patchAndFetch(...), .patchAndFetchById(id, ...), .delete(...), .deleteById(id)`
  - [Join Methods](https://vincit.github.io/objection.js/api/query-builder/join-methods.html): `.joinRelated('tableName'), .innerJoinRelated('tableName')`
  - [Eager Loading Methods](https://vincit.github.io/objection.js/api/query-builder/eager-methods.html#withgraphfetched): `.withGraphJoined('')`
  - [Extra Recipes and Techniques](https://vincit.github.io/objection.js/recipes/)
- [Swagger Specification](https://swagger.io/specification/)
- [JSON Schema Specification](https://json-schema.org/understanding-json-schema/index.html)

## Requirements

- Node.js >= 16.17.1 (LTS)
- PostgreSQL >= 14.0
- Redis >= 7.0.0
- Optional: `docker`

## Development

```bash
$npm run migrate
# run db migrations

$npm run seed
# seed db with test data

$ npm run dev
# run in development

$ npm run start
# run in production

$ npm run lint
# check for errors

$ npm run fix
# fix any errors

$ npm run test
# run tests
```

## Environment

See [.env.template](./.env.template)

## License

See [LICENSE.md](./LICENSE.md)

## Notes
- No tests for the tuya integration because the API is not working
- I used uuids instead of auto-incrementing ids because they're more suitable for distributed systems and more secure.