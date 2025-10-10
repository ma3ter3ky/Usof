import Joi from 'joi'
import { badRequest, forbidden, notFoundErr } from '../utils/httpError.js'
import { postsRepo } from '../repositories/posts.repo.js'

const postSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  body: Joi.string().min(1).required(),
  categoryIds: Joi.array().items(Joi.number().integer()).default([])
})

const updateSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  body: Joi.string().min(1),
  categoryIds: Joi.array().items(Joi.number().integer())
}).or('title', 'body', 'categoryIds')

export const postsService = {
  async list(params) {
    return postsRepo.list(params)
  },

  async findById(id) {
    const post = await postsRepo.findById(id)
    if (!post) throw notFoundErr('Post not found')
    return post
  },

  async create(authorId, input) {
    const { value, error } = postSchema.validate(input)
    if (error) throw badRequest(error.message)
    const post = { author_id: authorId, title: value.title, body: value.body }
    return postsRepo.create(post, value.categoryIds)
  },

  async update(user, id, patch) {
    const { value, error } = updateSchema.validate(patch)
    if (error) throw badRequest(error.message)
    const existing = await postsRepo.findById(id)
    if (!existing) throw notFoundErr('Post not found')

    if (user.role !== 'admin' && user.id !== existing.author_id) {
      throw forbidden('Not allowed to update this post')
    }
    return postsRepo.update(id, value, value.categoryIds)
  },

  async delete(user, id) {
    const post = await postsRepo.findById(id)
    if (!post) throw notFoundErr('Post not found')
    if (user.role !== 'admin' && user.id !== post.author_id) {
      throw forbidden('Not allowed to delete this post')
    }
    await postsRepo.delete(id)
    return { ok: true }
  }
}
