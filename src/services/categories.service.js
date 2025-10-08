import Joi from 'joi'
import { categoriesRepo } from '../repositories/categories.repo.js'
import { badRequest, notFoundErr, conflict } from '../utils/httpError.js'
import { slugify } from '../utils/slugify.js'

const createSchema = Joi.object({
  name: Joi.string().min(3).max(64).required(),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .max(64)
})

const updateSchema = Joi.object({
  name: Joi.string().min(3).max(64),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .min(3)
    .max(64)
}).min(1)

function handleUniqueError(e) {
  if (e && e.code === 'ER_DUP_ENTRY') {
    throw conflict('Category with such name or slug already exists')
  }
  throw e
}

export const categoriesService = {
  async list() {
    return categoriesRepo.list()
  },

  async get(id) {
    const row = await categoriesRepo.findById(Number(id))
    if (!row) throw notFoundErr('Category not found')
    return row
  },

  async create(input) {
    const { value, error } = createSchema.validate(input)
    if (error) throw badRequest(error.message)

    const name = value.name.trim()
    const slug = value.slug ? value.slug : slugify(name)

    try {
      return await categoriesRepo.create({ name, slug })
    } catch (e) {
      handleUniqueError(e)
    }
  },

  async update(id, input) {
    const { value, error } = updateSchema.validate(input)
    if (error) throw badRequest(error.message)

    const current = await categoriesRepo.findById(Number(id))
    if (!current) throw notFoundErr('Category not found')

    const name = value.name?.trim()
    const slug = value.slug ? value.slug : name ? slugify(name) : undefined

    try {
      return await categoriesRepo.update(Number(id), { name, slug })
    } catch (e) {
      handleUniqueError(e)
    }
  },

  async delete(id) {
    const n = await categoriesRepo.deleteById(Number(id))
    if (!n) throw notFoundErr('Category not found')
  }
}
