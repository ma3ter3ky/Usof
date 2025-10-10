import { Router } from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { methodNotAllowed } from '../middlewares/methodNotAllowed.js'
import { formidableImage } from '../middlewares/formidableImage.js'
import { postsController } from '../controllers/posts.controller.js'

const r = Router()

// TODO: ... other post routes here ...

r.route('/:id/images')
  .post(requireAuth, formidableImage(), postsController.uploadImage)
  .all(methodNotAllowed)

export default r
