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

import { mountAdmin } from './admin/index.js'

import healthRouter from './routes/health.js'
import authRouter from './routes/auth.routes.js'
import usersRouter from './routes/users.routes.js'
import categoriesRouter from './routes/categories.routes.js'
import postsRouter from './routes/posts.routes.js'

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

app.use('/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/posts', postsRouter)

mountAdmin(app)

app.use(notFound)
app.use(errorHandler)

export default app
