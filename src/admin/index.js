import AdminJS from 'adminjs'
import { buildRouter } from '@adminjs/express'
import expressFormidable from 'express-formidable'
import { requireAuth, requireRole } from '../middlewares/auth.js'

const admin = new AdminJS({
  rootPath: '/admin',
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

export function mountAdmin(app) {
  const adminRouter = buildRouter(admin)
  app.use(
    admin.options.rootPath,
    expressFormidable(),
    requireAuth,
    requireRole('admin'),
    adminRouter
  )
}
