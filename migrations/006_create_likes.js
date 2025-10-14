export async function up(knex) {
  const has = await knex.schema.hasTable('likes')
  if (has) return

  const { database } = knex.client.config.connection
  const col = await knex('information_schema.COLUMNS')
    .select('DATA_TYPE', 'COLUMN_TYPE')
    .where({
      TABLE_SCHEMA: database,
      TABLE_NAME: 'users',
      COLUMN_NAME: 'id'
    })
    .first()

  const usersIdIsBigInt = col?.DATA_TYPE?.toLowerCase() === 'bigint'
  const addAuthorId = t => {
    if (usersIdIsBigInt) t.bigInteger('author_id').unsigned().notNullable()
    else t.integer('author_id').unsigned().notNullable()
  }

  await knex.schema.createTable('likes', t => {
    t.increments('id').primary()

    addAuthorId(t)

    t.enum('target_type', ['post', 'comment']).notNullable()
    t.integer('target_id').unsigned().notNullable()

    t.integer('value').notNullable()

    t.timestamp('created_at').defaultTo(knex.fn.now())
    t.timestamp('updated_at').defaultTo(knex.fn.now())

    t.unique(['author_id', 'target_type', 'target_id'], 'uniq_like_per_target')
    t.index(['target_type', 'target_id'], 'idx_like_target')
  })

  await knex.schema.alterTable('likes', t => {
    t.foreign('author_id').references('id').inTable('users').onDelete('CASCADE')
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('likes')
}
