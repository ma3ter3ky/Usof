export async function up(knex) {
  await knex.schema.alterTable('users', t => {
    t.integer('refresh_token_version').notNullable().defaultTo(0)
  })
}
export async function down(knex) {
  await knex.schema.alterTable('users', t => {
    t.dropColumn('refresh_token_version')
  })
}
