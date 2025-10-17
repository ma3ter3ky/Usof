import { Router } from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { likesController } from '../controllers/likes.controller.js'

const r = Router()

r.route('/likes')
  .post(requireAuth, likesController.upsert)
  .delete(requireAuth, likesController.remove)
  .all(methodNotAllowed)

r.route('/posts/:post_id/likes')
  .get(requireAuth, requireRole('admin'), likesController.listPostLikes)
  .all(methodNotAllowed)

r.route('/comments/:comment_id/likes')
  .get(requireAuth, requireRole('admin'), likesController.listCommentLikes)
  .all(methodNotAllowed)

export default r
