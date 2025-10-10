import { db } from '../db.js'

export const postImagesRepo = {
  async insert(postId, path) {
    const [id] = await db('post_images').insert({ post_id: postId, path })
    return db('post_images').where({ id }).first()
  },
  async listByPost(postId) {
    return db('post_images')
      .select('id', 'path', 'created_at')
      .where({ post_id: postId })
      .orderBy('id', 'asc')
  }
}
