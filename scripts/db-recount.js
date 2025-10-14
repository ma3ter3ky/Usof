import { db } from '../src/db.js'

async function tableHasColumn(table, column) {
  const { database } = db.client.config.connection
  const row = await db('information_schema.COLUMNS')
    .select('COLUMN_NAME')
    .where({
      TABLE_SCHEMA: database,
      TABLE_NAME: table,
      COLUMN_NAME: column
    })
    .first()
  return !!row
}

async function recountPolymorphic() {
  await db.raw(`
    UPDATE posts p
    LEFT JOIN (
      SELECT target_id, COALESCE(SUM(value),0) AS sumv
      FROM likes
      WHERE target_type='post'
      GROUP BY target_id
    ) L ON L.target_id = p.id
    SET p.rating = COALESCE(L.sumv, 0)
  `)

  await db.raw(`
    UPDATE comments c
    LEFT JOIN (
      SELECT target_id, COALESCE(SUM(value),0) AS sumv
      FROM likes
      WHERE target_type='comment'
      GROUP BY target_id
    ) L ON L.target_id = c.id
    SET c.rating = COALESCE(L.sumv, 0)
  `)

  await db.raw(`
    UPDATE users u
    LEFT JOIN (
      SELECT author_id, SUM(rating) AS sumr
      FROM (
        SELECT author_id, rating FROM posts
        UNION ALL
        SELECT author_id, rating FROM comments
      ) x
      GROUP BY author_id
    ) R ON R.author_id = u.id
    SET u.rating = COALESCE(R.sumr, 0)
  `)
}

async function recountSplitColumns({ postCol, commentCol }) {
  if (postCol) {
    await db.raw(`
      UPDATE posts p
      LEFT JOIN (
        SELECT ${postCol} AS pid, COALESCE(SUM(value),0) AS sumv
        FROM likes
        WHERE ${postCol} IS NOT NULL
        GROUP BY ${postCol}
      ) L ON L.pid = p.id
      SET p.rating = COALESCE(L.sumv, 0)
    `)
  } else {
    await db.raw(`UPDATE posts SET rating = 0`)
  }

  if (commentCol) {
    await db.raw(`
      UPDATE comments c
      LEFT JOIN (
        SELECT ${commentCol} AS cid, COALESCE(SUM(value),0) AS sumv
        FROM likes
        WHERE ${commentCol} IS NOT NULL
        GROUP BY ${commentCol}
      ) L ON L.cid = c.id
      SET c.rating = COALESCE(L.sumv, 0)
    `)
  } else {
    await db.raw(`UPDATE comments SET rating = 0`)
  }

  await db.raw(`
    UPDATE users u
    LEFT JOIN (
      SELECT author_id, SUM(rating) AS sumr
      FROM (
        SELECT author_id, rating FROM posts
        UNION ALL
        SELECT author_id, rating FROM comments
      ) x
      GROUP BY author_id
    ) R ON R.author_id = u.id
    SET u.rating = COALESCE(R.sumr, 0)
  `)
}

async function recount() {
  for (const [table, col] of [
    ['posts', 'rating'],
    ['comments', 'rating'],
    ['users', 'rating']
  ]) {
    const has = await tableHasColumn(table, col)
    if (!has)
      throw new Error(
        `Column ${table}.${col} is missing. Run the migration that adds rating columns.`
      )
  }

  const hasTargetType = await tableHasColumn('likes', 'target_type')
  const hasTargetId = await tableHasColumn('likes', 'target_id')
  const hasPostId = await tableHasColumn('likes', 'post_id')
  const hasCommentId = await tableHasColumn('likes', 'comment_id')

  if (hasTargetType && hasTargetId) {
    await recountPolymorphic()
  } else if (hasPostId || hasCommentId) {
    await recountSplitColumns({
      postCol: hasPostId ? 'post_id' : null,
      commentCol: hasCommentId ? 'comment_id' : null
    })
  } else {
    throw new Error(
      'Unrecognized likes schema. Expecting (target_type,target_id) or (post_id/comment_id). ' +
        'Run: SHOW COLUMNS FROM likes; and align the recount script.'
    )
  }

  console.log('✅ Recounted ratings for posts, comments, and users')
}

recount()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Recount failed:', err)
    process.exit(1)
  })
