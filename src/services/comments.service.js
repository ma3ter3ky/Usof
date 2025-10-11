import Joi from 'joi'
import { commentsRepo } from '../repositories/comments.repo.js'
import { postsService } from './posts.service.js'
import { badRequest, forbidden, notFoundErr } from '../utils/httpError.js'

const MAX_DEPTH = 5

const createSchema = Joi.object({
  body: Joi.string().min(1).max(5000).required(),
  parent_id: Joi.number().integer().min(1).optional()
})

const updateSchema = Joi.object({
  body: Joi.string().min(1).max(5000).required()
})

export const commentsService = {
  async listByPostTree(postId) {
    const postIdNumber = Number(postId)
    await postsService.findById(postIdNumber)
    const rows = await commentsRepo.listByPostTree(postIdNumber, {})
    return rows
  },

  async create(user, postId, input) {
    const postIdNumber = Number(postId)
    await postsService.findById(postIdNumber)

    const { value, error } = createSchema.validate(input)
    if (error) throw badRequest(error.message)

    if (!value?.parent_id) {
      return commentsRepo.createTop({ post_id: postIdNumber, author_id: user.id, body: value.body })
    }

    const parent = await commentsRepo.findById(Number(value.parent_id))
    if (!parent || parent.post_id !== postIdNumber)
      throw badRequest('Invalid parent_id for this post', 'INVALID_PARENT')
    if (parent.depth + 1 > MAX_DEPTH)
      throw badRequest(`Max nesting depth is ${MAX_DEPTH}`, 'DEPTH_LIMIT')

    return commentsRepo.createReply({
      post_id: postIdNumber,
      parent_id: parent.id,
      author_id: user.id,
      body: value.body,
      parent_path: parent.path,
      parent_depth: parent.depth
    })
  },

  async update(user, id, input) {
    const cid = Number(id)
    const existing = await commentsRepo.findById(cid)
    if (!existing) throw notFoundErr('Comment not found')
    if (user.role !== 'admin' && user.id !== existing.author_id) {
      throw forbidden('Not allowed to update this comment')
    }

    const { value, error } = updateSchema.validate(input)
    if (error) throw badRequest(error.message)
    return commentsRepo.update(cid, { body: value.body })
  },

  async delete(user, id) {
    const cid = Number(id)
    const existing = await commentsRepo.findById(cid)
    if (!existing) throw notFoundErr('Comment not found')
    if (user.role !== 'admin' && user.id !== existing.author_id) {
      throw forbidden('Not allowed to delete this comment')
    }
    await commentsRepo.delete(cid)
    return { ok: true }
  }
}
