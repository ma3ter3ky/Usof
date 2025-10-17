/* eslint-disable*/
import { db } from '../db.js'

export const likesRepo = {
  async findByAuthorTarget(authorId, type, targetId) {
    return db('likes')
      .select('id', 'author_id', 'target_type', 'target_id', 'value')
      .where({ author_id: authorId, target_type: type, target_id: targetId })
      .first()
  },

  async listByTarget(type, targetId) {
    return db('likes')
      .select('id', 'author_id', 'target_type', 'target_id', 'value', 'created_at', 'updated_at')
      .where({ target_type: type, target_id: targetId })
      .orderBy('created_at', 'asc')
  },

  async insert(trx, { author_id, target_type, target_id, value }) {
    const [id] = await trx('likes').insert({ author_id, target_type, target_id, value })
    return id
  },

  async updateValue(trx, id, value) {
    await trx('likes').where({ id }).update({ value, updated_at: trx.fn.now() })
  },

  async deleteByAuthorTarget(trx, authorId, type, targetId) {
    return trx('likes').where({ author_id: authorId, target_type: type, target_id: targetId }).del()
  },

  async fetchTarget(trx, target_type, target_id) {
    if (target_type === 'post') {
      return trx('posts').select('id', 'author_id').where({ id: target_id }).first()
    }
    return trx('comments').select('id', 'author_id').where({ id: target_id }).first()
  },

  async applyDelta(trx, target_type, target_id, author_id, delta) {
    if (!delta) return

    const targetTable = target_type === 'post' ? 'posts' : 'comments'
    await trx(targetTable)
      .where({ id: target_id })
      .update({ rating: trx.raw('rating + ?', [delta]) })

    await trx('users')
      .where({ id: author_id })
      .update({ rating: trx.raw('rating + ?', [delta]) })
  }
}
