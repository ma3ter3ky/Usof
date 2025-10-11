import { usersService } from '../services/users.service.js'
import path from 'node:path'
import { badRequest, unauthorized } from '../utils/httpError.js'
import { randomName, moveToUploads } from '../utils/upload.js'

const AVATARS_DIR = path.join('uploads', 'avatars')

export const usersController = {
  async list(req, res, next) {
    try {
      const data = await usersService.list(req.query)
      res.json(data)
    } catch (e) {
      next(e)
    }
  },

  async get(req, res, next) {
    try {
      const user = await usersService.getById(req.params.id)
      res.json(user)
    } catch (e) {
      next(e)
    }
  },

  async create(req, res, next) {
    try {
      const created = await usersService.createByAdmin(req.body)
      res.status(201).json(created)
    } catch (e) {
      next(e)
    }
  },

  async patch(req, res, next) {
    try {
      if (!req.user) throw unauthorized('No session')
      const isAdmin = req.user.role === 'admin'
      const userId = Number(req.params.id)

      const data = isAdmin
        ? await usersService.updateByAdmin(userId, req.body)
        : await usersService.updateSelf(req.user.id, userId, req.body)

      res.json(data)
    } catch (e) {
      next(e)
    }
  },

  async remove(req, res, next) {
    try {
      await usersService.deleteById(req.params.id)
      res.status(204).send()
    } catch (e) {
      next(e)
    }
  },

  async uploadAvatar(req, res, next) {
    try {
      const file = req.files?.image
      if (!file) throw badRequest('No file uploaded', 'NO_FILE')

      const ext = path.extname(file.name)
      if (!ext)
        throw badRequest(
          'Unsupported image type. Allowed: png, jpeg, webp',
          'UNSUPPORTED_MEDIA_TYPE'
        )

      if (file.size > 2 * 1024 * 1024)
        throw badRequest('File too large (max 2MB)', 'LIMIT_FILE_SIZE')

      const safeName = `u${req.user.id}_${randomName(ext)}`
      await moveToUploads(file.path, AVATARS_DIR, safeName)
      const publicPath = path.posix.join('/uploads', 'avatars', safeName)

      const updated = await usersService.updateSelf(req.user.id, req.user.id, {
        profile_picture: publicPath
      })
      res.status(200).json({ ok: true, path: publicPath, user: updated })
    } catch (e) {
      next(e)
    }
  }
}
