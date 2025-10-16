import Joi from 'joi'
import { badRequest, forbidden, notFoundErr } from '../utils/httpError.js'
import { postsRepo } from '../repositories/posts.repo.js'

const postSchema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  body: Joi.string().min(1).required(),
  categoryIds: Joi.array().items(Joi.number().integer()).default([])
})

const updateSchema = Joi.object({
  title: Joi.string().min(3).max(200),
  body: Joi.string().min(1),
  categoryIds: Joi.array().items(Joi.number().integer())
}).or('title', 'body', 'categoryIds')

const statusSchema = Joi.object({
  status: Joi.string().valid('active', 'inactive').required()
})

const listSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  authorId: Joi.number().integer().min(1),
  categories: Joi.array().items(Joi.number().integer().min(1)).default([]),
  statuses: Joi.array()
    .items(Joi.string().valid('active', 'inactive').insensitive().lowercase())
    .default([]),
  from: Joi.date().iso(),
  to: Joi.date().iso(),
  sort: Joi.string().valid('date', 'likes').default('date'),
  direction: Joi.string().valid('asc', 'desc').default('desc')
})

function normalizeCsv(value) {
  if (value === undefined || value === null) return undefined
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value
      .split(',')
      .map(part => part.trim())
      .filter(Boolean)
  }
  return undefined
}

function normalizeListParams(params = {}) {
  const normalized = { ...params }

  if (normalized.author_id && !normalized.authorId) {
    normalized.authorId = normalized.author_id
  }

  const rawCategories = normalized.categories ?? normalized.categoryIds ?? normalized.category_id
  const categories = normalizeCsv(rawCategories)
  if (categories) {
    normalized.categories = categories
  }

  const rawStatuses = normalizeCsv(normalized.status ?? normalized.statuses)
  if (rawStatuses) {
    normalized.statuses = rawStatuses
  }

  const rawOrder = normalized.order
  if (!normalized.sort && typeof rawOrder === 'string') {
    const [rawCol, rawDir] = rawOrder.split(':')
    const col = rawCol?.toLowerCase()
    const dir = rawDir?.toLowerCase()
    if (col === 'rating') normalized.sort = 'likes'
    else if (col === 'created_at') normalized.sort = 'date'
    if (dir) normalized.direction = dir
  }

  if (!normalized.sort && normalized.orderBy) {
    const mapped = String(normalized.orderBy).toLowerCase()
    if (mapped === 'rating' || mapped === 'likes') normalized.sort = 'likes'
    else if (mapped === 'created_at' || mapped === 'date') normalized.sort = 'date'
    else normalized.sort = mapped
  }

  if (!normalized.direction && normalized.sortDir) {
    normalized.direction = String(normalized.sortDir).toLowerCase()
  }

  if (normalized.from === undefined && normalized.date_from) {
    normalized.from = normalized.date_from
  }

  if (normalized.to === undefined && normalized.date_to) {
    normalized.to = normalized.date_to
  }

  return normalized
}

export const postsService = {
  async list(user, params) {
    const normalized = normalizeListParams(params)
    const { value, error } = listSchema.validate(normalized, {
      abortEarly: false,
      convert: true
    })
    if (error) throw badRequest(error.message)

    const isAdmin = user?.role === 'admin'
    const statuses = value.statuses.length ? value.statuses : undefined

    if (!isAdmin) {
      const requestedStatuses = statuses ?? value.statuses
      if (requestedStatuses && requestedStatuses.length) {
        const disallowed = requestedStatuses.some(status => status !== 'active')
        if (disallowed) throw forbidden('Not allowed to view requested status')
      }
    }

    const effectiveStatuses = isAdmin
      ? statuses
      : statuses && statuses.length
        ? statuses
        : ['active']

    return postsRepo.list({
      page: value.page,
      limit: value.limit,
      authorId: value.authorId,
      categories: value.categories,
      statuses: effectiveStatuses,
      dateFrom: value.from,
      dateTo: value.to,
      sortBy: value.sort === 'likes' ? 'rating' : 'created_at',
      sortDir: value.direction
    })
  },

  async findById(id, viewer) {
    const post = await postsRepo.findById(id)
    if (!post) throw notFoundErr('Post not found')
    const isAdmin = viewer?.role === 'admin'
    const isAuthor = viewer && viewer.id === post.author_id
    if (post.status !== 'active' && !isAdmin && !isAuthor) {
      throw notFoundErr('Post not found')
    }
    return post
  },

  async create(authorId, input) {
    const { value, error } = postSchema.validate(input)
    if (error) throw badRequest(error.message)
    const post = { author_id: authorId, title: value.title, body: value.body, status: 'active' }
    return postsRepo.create(post, value.categoryIds)
  },

  async update(user, id, patch) {
    const { value, error } = updateSchema.validate(patch)
    if (error) throw badRequest(error.message)
    const existing = await postsRepo.findById(id)
    if (!existing) throw notFoundErr('Post not found')

    if (user.role !== 'admin' && user.id !== existing.author_id) {
      throw forbidden('Not allowed to update this post')
    }
    return postsRepo.update(id, value, value.categoryIds)
  },

  async delete(user, id) {
    const post = await postsRepo.findById(id)
    if (!post) throw notFoundErr('Post not found')
    if (user.role !== 'admin' && user.id !== post.author_id) {
      throw forbidden('Not allowed to delete this post')
    }
    await postsRepo.delete(id)
    return { ok: true }
  },

  async setStatus(user, id, input) {
    if (user.role !== 'admin') throw forbidden('Only admins can change post status')

    const post = await postsRepo.findById(id)
    if (!post) throw notFoundErr('Post not found')

    const { value, error } = statusSchema.validate(input)
    if (error) throw badRequest(error.message)

    return postsRepo.update(id, { status: value.status })
  }
}
