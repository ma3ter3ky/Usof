import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { formidableImage } from '../middlewares/formidableImage.js'
import { postsController } from '../controllers/posts.controller.js'

const r = Router()

r.route('/:id/images')
  .post(requireAuth, formidableImage(), postsController.uploadImage)
  .all(methodNotAllowed)

r.route('/:id')
  .get(postsController.get)
  .patch(requireAuth, postsController.patch)
  .delete(requireAuth, postsController.remove)
  .all(methodNotAllowed)

r.route('/')
  .get(postsController.list)
  .post(requireAuth, postsController.create)
  .all(methodNotAllowed)

export default r
