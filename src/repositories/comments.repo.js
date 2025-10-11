/* eslint-disable */
import { db } from '../db.js'

const PAD = 6

function pad(n) {
  return String(n).padStart(PAD, '0')
}

export const commentsRepo = {
  async listByPost(postId, { page = 1, limit = 10 }) {
    const l = Math.min(Number(limit) || 10, 50)
    const p = Math.max(Number(page) || 1, 1)
    return db('comments')
      .select('id', 'post_id', 'author_id', 'body', 'created_at', 'updated_at')
      .where({ post_id: postId })
      .orderBy('id', 'asc')
      .limit(l)
      .offset((p - 1) * l)
  },

  async listByPostTree(postId, { page = 1, limit = 50 }) {
    return db('comments')
      .select(
        'id',
        'post_id',
        'parent_id',
        'author_id',
        'body',
        'depth',
        'path',
        'created_at',
        'updated_at'
      )
      .where({ post_id: postId })
      .orderBy([
        { column: 'path', order: 'asc' },
        { column: 'created_at', order: 'asc' }
      ])
  },

  async findById(id) {
    return db('comments')
      .select(
        'id',
        'post_id',
        'parent_id',
        'author_id',
        'body',
        'depth',
        'path',
        'created_at',
        'updated_at'
      )
      .where({ id })
      .first()
  },

  async createTop({ post_id, author_id, body }) {
    const [id] = await db('comments').insert({ post_id, author_id, body, depth: 0, path: '' })
    const path = pad(id)
    await db('comments').where({ id }).update({ path })
    return this.findById(id)
  },

  async createReply({ post_id, parent_id, author_id, body, parent_path, parent_depth }) {
    const [id] = await db('comments').insert({
      post_id,
      parent_id,
      author_id,
      body,
      depth: parent_depth + 1,
      path: ''
    })
    const path = `${parent_path}.${pad(id)}`
    await db('comments').where({ id }).update({ path })
    return this.findById(id)
  },

  async update(id, { body }) {
    await db('comments').where({ id }).update({ body, updated_at: db.fn.now() })
    return this.findById(id)
  },

  async delete(id) {
    await db('comments').where({ id }).del()
  }
}
