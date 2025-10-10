import { db } from '../db.js'
import { notFoundErr } from '../utils/httpError.js'

export const postsService = {
  async assertExists(id) {
    const row = await db('posts').select('id', 'author_id').where({ id }).first()
    if (!row) throw notFoundErr('Post not found')
    return row
  }
}
