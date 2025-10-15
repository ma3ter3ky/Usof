import { Router } from 'express'
import { requireAuth, requireRole } from '../middlewares/auth.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { commentsController } from '../controllers/comments.controller.js'

const r = Router()

r.route('/posts/:postId/comments')
  .get(commentsController.listByPost)
  .post(requireAuth, commentsController.create)
  .all(methodNotAllowed)

r.route('/comments/:id')
  .patch(requireAuth, commentsController.patch)
  .delete(requireAuth, commentsController.remove)
  .all(methodNotAllowed)

r.route('/comments/:id/status')
  .patch(requireAuth, requireRole('admin'), commentsController.setStatus)
  .all(methodNotAllowed)

export default r
