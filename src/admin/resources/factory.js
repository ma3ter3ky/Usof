import KnexResource from './knexResource.js'
import { TABLE_DEFINITIONS } from './tableDefinitions.js'

export function createResource(knex, tableName) {
  const definition = TABLE_DEFINITIONS[tableName]
  if (!definition) {
    throw new Error(`Unknown table definition for ${tableName}`)
  }
  return new KnexResource({
    knex,
    tableName,
    ...definition
  })
}
