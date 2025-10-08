export async function up(knex) {
  await knex.schema.createTable('categories', table => {
    table.increments('id').primary()
    table.string('name', 64).notNullable()
    table.string('slug', 64).notNullable().unique()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('categories')
}
