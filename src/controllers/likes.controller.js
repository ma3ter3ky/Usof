import { likesService } from '../services/likes.service.js'

export const likesController = {
  async upsert(req, res, next) {
    try {
      const result = await likesService.upsert(req.user, req.body)
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  },
  async remove(req, res, next) {
    try {
      const result = await likesService.remove(req.user, req.body)
      res.status(200).json(result)
    } catch (e) {
      next(e)
    }
  },

  async listPostLikes(req, res, next) {
    try {
      const likes = await likesService.listPostLikes(req.user, req.params.post_id)
      res.json(likes)
    } catch (e) {
      next(e)
    }
  },

  async listCommentLikes(req, res, next) {
    try {
      const likes = await likesService.listCommentLikes(req.params.comment_id)
      res.json(likes)
    } catch (e) {
      next(e)
    }
  }
}
