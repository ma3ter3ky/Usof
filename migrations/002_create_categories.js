export async function up(knex) {
  await knex.schema.createTable('categories', t => {
    t.bigIncrements('id').primary()
    t.string('title', 128).notNullable().unique()
    t.text('description').nullable()
    t.timestamps(true, true)
  })
}
export async function down(knex) {
  await knex.schema.dropTableIfExists('categories')
}
