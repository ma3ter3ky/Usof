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
    authorId,
    categories,
    statuses,
    dateFrom,
    dateTo,
    sortBy = 'created_at',
    sortDir = 'desc'
  }) {
    const safeLimit = Math.min(Number(limit) || 10, 100)
    const safePage = Math.max(Number(page) || 1, 1)

    const q = db('posts as p').select('p.*')

    if (authorId) {
      q.where('p.author_id', authorId)
    }

    if (Array.isArray(categories) && categories.length) {
      q.whereExists(function () {
        this.select(1)
          .from('post_categories as pc')
          .whereRaw('pc.post_id = p.id')
          .whereIn('pc.category_id', categories)
      })
    }

    if (Array.isArray(statuses) && statuses.length) {
      q.whereIn('p.status', statuses)
    }

    if (dateFrom) {
      q.where('p.created_at', '>=', dateFrom)
    }

    if (dateTo) {
      q.where('p.created_at', '<=', dateTo)
    }

    const direction = sortDir === 'asc' ? 'asc' : 'desc'
    const orderColumn = sortBy === 'rating' ? 'p.rating' : 'p.created_at'
    q.orderBy(orderColumn, direction).orderBy('p.id', 'desc')

    return q.limit(safeLimit).offset((safePage - 1) * safeLimit)
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
