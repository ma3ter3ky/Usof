import { BaseProperty, BaseResource } from 'adminjs'

function normalizeSort({ sortBy, direction } = {}) {
  if (!sortBy) return null
  return { sortBy, direction: direction === 'desc' ? 'desc' : 'asc' }
}

function sanitizeParams(params, propertyMap) {
  return Object.entries(params ?? {}).reduce((acc, [key, value]) => {
    if (!propertyMap.has(key)) return acc
    if (value === undefined) return acc
    acc[key] = value
    return acc
  }, {})
}

function mapProperties(definitions) {
  return definitions.map(
    (definition, index) =>
      new BaseProperty({
        ...definition,
        position: index + 1
      })
  )
}

function createPropertyMap(properties) {
  return properties.reduce((acc, property) => {
    acc.set(property.path(), property)
    return acc
  }, new Map())
}

function applyFilter(query, filter) {
  if (!filter) return query
  return filter.reduce((memo, element) => {
    if (!element?.property) return memo
    const { path, value } = element
    if (value === undefined || value === null || value === '') return memo
    if (typeof value === 'object' && 'from' in value) {
      const { from, to } = value
      if (from) memo.where(path, '>=', from)
      if (to) memo.where(path, '<=', to)
      return memo
    }
    memo.where(path, value)
    return memo
  }, query)
}

export default class KnexResource extends BaseResource {
  constructor({ knex, tableName, primaryKey = 'id', properties }) {
    super({ knex, tableName, primaryKey })
    this.knex = knex
    this.tableName = tableName
    this.primaryKey = primaryKey
    this.propertiesList = mapProperties(properties)
    this.propertyMap = createPropertyMap(this.propertiesList)
  }

  databaseName() {
    const { connection = {} } = this.knex?.client?.config ?? {}
    return connection.database ?? connection.filename ?? 'mysql'
  }

  databaseType() {
    return 'mysql'
  }

  name() {
    return this.tableName
  }

  id() {
    return this.tableName
  }

  properties() {
    return this.propertiesList
  }

  property(path) {
    return this.propertyMap.get(path) ?? null
  }

  async count(filter) {
    const query = applyFilter(this.knex(this.tableName), filter)
    const result = await query.clone().count({ count: '*' })
    const [{ count }] = result
    return Number(count)
  }

  async find(filter, options = {}) {
    let query = applyFilter(this.knex(this.tableName), filter)
    const sort = normalizeSort(options.sort)
    if (sort) {
      query = query.orderBy(sort.sortBy, sort.direction)
    }
    if (options.offset) {
      query = query.offset(options.offset)
    }
    if (options.limit) {
      query = query.limit(options.limit)
    }
    const records = await query
    return records.map(record => this.build(record))
  }

  async findOne(id) {
    const record = await this.knex(this.tableName).where(this.primaryKey, id).first()
    return record ? this.build(record) : null
  }

  async findMany(ids) {
    if (!ids?.length) return []
    const records = await this.knex(this.tableName).whereIn(this.primaryKey, ids)
    return records.map(record => this.build(record))
  }

  async create(params) {
    const data = sanitizeParams(params, this.propertyMap)
    const [insertedId] = await this.knex(this.tableName).insert(data)
    const primaryValue = data[this.primaryKey] ?? insertedId
    const created = await this.knex(this.tableName).where(this.primaryKey, primaryValue).first()
    return this.build(created)
  }

  async update(id, params) {
    const data = sanitizeParams(params, this.propertyMap)
    await this.knex(this.tableName).where(this.primaryKey, id).update(data)
    const updated = await this.knex(this.tableName).where(this.primaryKey, id).first()
    return this.build(updated)
  }

  async delete(id) {
    await this.knex(this.tableName).where(this.primaryKey, id).delete()
    return id
  }
}
