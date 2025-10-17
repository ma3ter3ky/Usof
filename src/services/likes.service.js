/* eslint-disable*/

import Joi from 'joi'
import { db } from '../db.js'
import { likesRepo } from '../repositories/likes.repo.js'
import { postsService } from './posts.service.js'
import { commentsRepo } from '../repositories/comments.repo.js'
import { badRequest, notFoundErr } from '../utils/httpError.js'

const upsertSchema = Joi.object({
  target_type: Joi.string().valid('post', 'comment').required(),
  target_id: Joi.number().integer().min(1).required(),
  value: Joi.number().valid(-1, 1).required()
})

const removeSchema = Joi.object({
  target_type: Joi.string().valid('post', 'comment').required(),
  target_id: Joi.number().integer().min(1).required()
})

const targetIdSchema = Joi.number().integer().min(1).required()

function parseTargetId(rawId, label) {
  const { value, error } = targetIdSchema.label(label).validate(rawId)
  if (error) throw badRequest(error.message)
  return value
}

export const likesService = {
  async upsert(user, input) {
    const { value, error } = upsertSchema.validate(input)
    if (error) throw badRequest(error.message)

    const { target_type, target_id } = value

    if (target_type === 'post') {
      await postsService.findById(target_id, user)
    } else {
      const c = await commentsRepo.findById(target_id)
      if (!c) throw notFoundErr('Comment not found')
    }

    return db.transaction(async trx => {
      const existing = await likesRepo.findByAuthorTarget(user.id, target_type, target_id)

      const target = await likesRepo.fetchTarget(trx, target_type, target_id)
      if (!target) {
        throw notFoundErr(target_type === 'post' ? 'Post not found' : 'Comment not found')
      }

      let delta = 0
      let result

      if (!existing) {
        const id = await likesRepo.insert(trx, {
          author_id: user.id,
          target_type,
          target_id,
          value: value.value
        })
        delta = value.value
        result = { id, target_type, target_id, value: value.value, status: 'created' }
      } else if (existing.value !== value.value) {
        await likesRepo.updateValue(trx, existing.id, value.value)
        delta = value.value - existing.value
        result = { id: existing.id, target_type, target_id, value: value.value, status: 'updated' }
      } else {
        result = {
          id: existing.id,
          target_type,
          target_id,
          value: existing.value,
          status: 'unchanged'
        }
      }

      if (delta !== 0) {
        await likesRepo.applyDelta(trx, target_type, target_id, target.author_id, delta)
      }

      return result
    })
  },

  async remove(user, input) {
    const { value, error } = removeSchema.validate(input)
    if (error) throw badRequest(error.message)

    const { target_type, target_id } = value

    return db.transaction(async trx => {
      const existing = await likesRepo.findByAuthorTarget(user.id, target_type, target_id)
      if (!existing) {
        return { ok: true, deleted: 0 }
      }

      const target = await likesRepo.fetchTarget(trx, target_type, target_id)
      if (!target) {
        await likesRepo.deleteByAuthorTarget(trx, user.id, target_type, target_id)
        return { ok: true, deleted: 1 }
      }

      const deleted = await likesRepo.deleteByAuthorTarget(trx, user.id, target_type, target_id)

      const delta = -existing.value
      await likesRepo.applyDelta(trx, target_type, target_id, target.author_id, delta)

      return { ok: true, deleted }
    })
  },

  async listPostLikes(user, postId) {
    const pid = parseTargetId(postId, 'post_id')

    await postsService.findById(pid, user)

    return likesRepo.listByTarget('post', pid)
  },

  async listCommentLikes(commentId) {
    const cid = parseTargetId(commentId, 'comment_id')

    const existing = await commentsRepo.findById(cid)
    if (!existing) throw notFoundErr('Comment not found')

    return likesRepo.listByTarget('comment', cid)
  }
}
