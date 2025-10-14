import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { likesController } from '../controllers/likes.controller.js'

const r = Router()

r.route('/likes')
  .post(requireAuth, likesController.upsert)
  .delete(requireAuth, likesController.remove)
  .all(methodNotAllowed)

export default r
