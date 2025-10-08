import { db } from '../db.js'

export const categoriesRepo = {
  async list() {
    return db('categories')
      .select('id', 'name', 'slug', 'created_at', 'updated_at')
      .orderBy('created_at', 'desc')
  },

  async findById(id) {
    return db('categories')
      .select('id', 'name', 'slug', 'created_at', 'updated_at')
      .where({ id })
      .first()
  },

  async findBySlug(slug) {
    return db('categories')
      .select('id', 'name', 'slug', 'created_at', 'updated_at')
      .where({ slug })
      .first()
  },

  async create({ name, slug }) {
    const [id] = await db('categories').insert({ name, slug })
    return this.findById(id)
  },

  async update(id, { name, slug }) {
    await db('categories')
      .where({ id })
      .update({ ...(name ? { name } : {}), ...(slug ? { slug } : {}), updated_at: db.fn.now() })
    return this.findById(id)
  },

  async deleteById(id) {
    return db('categories').where({ id }).del()
  }
}
