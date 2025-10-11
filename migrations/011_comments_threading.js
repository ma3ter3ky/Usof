export async function up(knex) {
  await knex.schema.alterTable('comments', t => {
    t.integer('parent_id').unsigned().nullable().after('post_id')
    t.tinyint('depth').unsigned().notNullable().defaultTo(0).after('parent_id')
    t.string('path', 255).notNullable().defaultTo('').after('depth')

    t.foreign('parent_id').references('id').inTable('comments').onDelete('CASCADE')
    t.index(['post_id', 'path'])
    t.index(['post_id', 'parent_id'])
    t.index(['parent_id'])
  })

  await knex.raw(`
      UPDATE comments
      SET depth = 0,
          path  = LPAD(id, 10, '0')
      WHERE parent_id IS NULL
         OR parent_id = 0
  `)
}

export async function down(knex) {
  await knex.schema.alterTable('comments', t => {
    t.dropForeign('parent_id')
    t.dropIndex(['post_id', 'path'])
    t.dropIndex(['post_id', 'parent_id'])
    t.dropIndex(['parent_id'])
    t.dropColumn('parent_id')
    t.dropColumn('depth')
    t.dropColumn('path')
  })
}
