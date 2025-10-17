import AdminJS from 'adminjs'
import { db } from '../db.js'
import { buildRouter } from '@adminjs/express'
import expressFormidable from 'express-formidable'
import { requireAuth, requireRole } from '../middlewares/auth.js'

import makeUserResource from './resources/userResource.js'
import { createResource } from './resources/factory.js'

const DEFAULT_TABLES = [
  'posts',
  'categories',
  'comments',
  'likes',
  'password_reset_tokens',
  'email_verification_tokens'
]

let mounted = false

function buildTableResources(knex, tables) {
  return tables.map(tableName => ({ resource: createResource(knex, tableName) }))
}

export async function mountAdmin(app) {
  if (mounted) return

  const resources = [makeUserResource(db), ...buildTableResources(db, DEFAULT_TABLES)]

  const admin = new AdminJS({
    rootPath: '/admin',
    resources,
    branding: {
      companyName: 'USOF Admin',
      softwareBrothers: false,
      logo: false
    },
    pages: {
      dashboard: {
        label: 'Overview',
        handler: async (_req, res) => {
          res.json({ status: 'ok', msg: 'AdminJS placeholder' })
        },
        component: false
      }
    }
  })
  const adminRouter = buildRouter(admin)
  app.use(
    admin.options.rootPath,
    expressFormidable(),
    requireAuth,
    requireRole('admin'),
    adminRouter
  )
  mounted = true
}
