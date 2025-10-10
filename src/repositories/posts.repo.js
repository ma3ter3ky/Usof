import { db } from '../db.js'

export const postsRepo = {
  async create(post, categoryIds) {
    return await db.transaction(async trx => {
      const [id] = await trx('posts').insert(post)
      if (Array.isArray(categoryIds) && categoryIds.length) {
        const rows = categoryIds.map(cid => ({ post_id: id, category_id: cid }))
        await trx('post_categories').insert(rows)
      }
      return trx('posts').where({ id }).first()
    })
  },

  async list({
    page = 1,
    limit = 10,
    author_id: authorId,
    category_id: categoryId,
    order = 'created_at:desc'
  }) {
    const q = db('posts')
      .select('posts.*')
      .leftJoin('users', 'users.id', 'posts.author_id')
      .modify(query => {
        if (authorId) query.where('author_id', authorId)
        if (categoryId) {
          query.join('post_categories', 'post_categories.post_id', 'posts.id')
          query.where('post_categories.category_id', categoryId)
        }
      })
    const [col, dir] = order.split(':')
    if (col) q.orderBy(col, dir === 'asc' ? 'asc' : 'desc')
    return q.limit(limit).offset((page - 1) * limit)
  },

  async findById(id) {
    const post = await db('posts').where({ id }).first()
    if (!post) return null
    const categories = await db('post_categories')
      .join('categories', 'categories.id', 'post_categories.category_id')
      .where('post_categories.post_id', id)
      .select('categories.id', 'categories.name', 'categories.slug')
    return { ...post, categories }
  },

  async update(id, patch, categoryIds) {
    return await db.transaction(async trx => {
      await trx('posts')
        .where({ id })
        .update({ ...patch, updated_at: db.fn.now() })
      if (Array.isArray(categoryIds)) {
        await trx('post_categories').where({ post_id: id }).del()
        if (categoryIds.length) {
          await trx('post_categories').insert(
            categoryIds.map(cid => ({ post_id: id, category_id: cid }))
          )
        }
      }
      return trx('posts').where({ id }).first()
    })
  },

  async delete(id) {
    await db('posts').where({ id }).del()
  }
}
