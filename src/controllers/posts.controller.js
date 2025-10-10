import path from 'node:path'
import { badRequest, forbidden } from '../utils/httpError.js'
import { randomName, moveToUploads } from '../utils/upload.js'
import { postsService } from '../services/posts.service.js'
import { postImagesRepo } from '../repositories/postImages.repo.js'

const POSTS_DIR = path.join('uploads', 'posts')

export const postsController = {
  async list(req, res, next) {
    try {
      const posts = await postsService.list(req.query)
      res.json(posts)
    } catch (e) {
      next(e)
    }
  },

  async get(req, res, next) {
    try {
      const post = await postsService.findById(Number(req.params.id))
      res.json(post)
    } catch (e) {
      next(e)
    }
  },

  async create(req, res, next) {
    try {
      const post = await postsService.create(req.user.id, req.body)
      res.status(201).json(post)
    } catch (e) {
      next(e)
    }
  },

  async patch(req, res, next) {
    try {
      const updated = await postsService.update(req.user, Number(req.params.id), req.body)
      res.json(updated)
    } catch (e) {
      next(e)
    }
  },

  async remove(req, res, next) {
    try {
      const r = await postsService.delete(req.user, Number(req.params.id))
      res.json(r)
    } catch (e) {
      next(e)
    }
  },

  async uploadImage(req, res, next) {
    try {
      if (!req.user) throw badRequest('Unauthorized')
      const postId = Number(req.params.id)
      const post = await postsService.findById(postId)

      if (req.user.role !== 'admin' && req.user.id !== post.author_id) {
        throw forbidden('Not allowed to upload to this post')
      }

      const file = req.files?.image
      if (!file) throw badRequest('No file uploaded', 'NO_FILE')

      const ext = path.extname(file)
      if (!ext)
        throw badRequest(
          'Unsupported image type. Allowed: png, jpeg, webp',
          'UNSUPPORTED_MEDIA_TYPE'
        )
      if (file.size > 2 * 1024 * 1024)
        throw badRequest('File too large (max 2MB)', 'LIMIT_FILE_SIZE')

      const safeName = `p${postId}_${randomName(ext)}`
      await moveToUploads(file.path, POSTS_DIR, safeName)
      const publicPath = path.posix.join('/uploads', 'posts', safeName)

      const saved = await postImagesRepo.insert(postId, publicPath)
      res.status(201).json({ ok: true, image: saved })
    } catch (e) {
      next(e)
    }
  }
}
