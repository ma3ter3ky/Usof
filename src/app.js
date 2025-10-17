/* eslint-disable */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import pinoHttp from 'pino-http'
import { logger } from './logger.js'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'

import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { authLimiter, writeLimiter } from './middlewares/rateLimit.js'

import { mountAdmin } from './admin/index.js'

import healthRouter from './routes/health.js'
import authRouter from './routes/auth.routes.js'
import usersRouter from './routes/users.routes.js'
import categoriesRouter from './routes/categories.routes.js'
import postsRouter from './routes/posts.routes.js'
import commentsRouter from './routes/comments.routes.js'
import likesRouter from './routes/likes.routes.js'

const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(pinoHttp({ logger }))
app.use(cookieParser())

function ensureUploadDirs() {
  const dirs = ['uploads', path.join('uploads', 'avatars'), path.join('uploads', 'posts')]
  for (const d of dirs) {
    if (!existsSync(d)) mkdirSync(d, { recursive: true })
  }
}

ensureUploadDirs()

import AdminJS from 'adminjs'
import Plugin from '@adminjs/express'
import { Adapter, Database, Resource } from '@adminjs/sql'
import makeUserResource from './admin/resources/userResource.js'

AdminJS.registerAdapter({
  Database,
  Resource
})

const database = await new Adapter('mysql2', {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}).init()

const admin = new AdminJS({
  resources: [
    makeUserResource(database), // users
    { resource: database.table('posts') },
    { resource: database.table('categories') },
    { resource: database.table('comments') },
    { resource: database.table('likes') },
    { resource: database.table('password_reset_tokens') },
    { resource: database.table('email_verification_tokens') }
  ]
})

admin.watch()
const router = Plugin.buildRouter(admin)
app.use(admin.options.rootPath, router)

app.use(
  '/uploads',
  express.static('uploads', {
    dotfiles: 'ignore',
    etag: true,
    maxAge: '7d',
    setHeaders: res => {
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.setHeader('Cache-Control', 'public, max-age=604800, immutable')
    }
  })
)

app.use('/seeds', express.static('seeds'))

app.use('/api/auth/login', authLimiter)
app.use('/api/auth/password-reset', authLimiter)
app.use('/api/auth/verify/resend', authLimiter)
app.use(['/api/posts', '/api/comments'], writeLimiter)

app.use('/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/posts', postsRouter)
app.use('/api', commentsRouter)
app.use('/api', likesRouter)

/*await mountAdmin(app)*/

app.use(notFound)
app.use(errorHandler)

export default app
