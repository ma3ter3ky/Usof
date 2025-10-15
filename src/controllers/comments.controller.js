import { commentsService } from '../services/comments.service.js'

export const commentsController = {
  async listByPost(req, res, next) {
    try {
      const rows = await commentsService.listByPostTree(req.params.postId)
      res.json(rows)
    } catch (e) {
      next(e)
    }
  },

  async create(req, res, next) {
    try {
      const row = await commentsService.create(req.user, req.params.postId, req.body)
      res.status(201).json(row)
    } catch (e) {
      next(e)
    }
  },

  async patch(req, res, next) {
    try {
      const row = await commentsService.update(req.user, req.params.id, req.body)
      res.json(row)
    } catch (e) {
      next(e)
    }
  },

  async setStatus(req, res, next) {
    try {
      const row = await commentsService.setStatus(req.user, req.params.id, req.body)
      res.json(row)
    } catch (e) {
      next(e)
    }
  },

  async remove(req, res, next) {
    try {
      const r = await commentsService.delete(req.user, req.params.id)
      res.json(r)
    } catch (e) {
      next(e)
    }
  }
}
