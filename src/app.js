import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import pinoHttp from 'pino-http'
import { logger } from './logger.js'
import cookieParser from 'cookie-parser'

import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

import { mountAdmin } from './admin/index.js'

import healthRouter from './routes/health.js'
import authRouter from './routes/auth.routes.js'
import usersRouter from './routes/users.routes.js'
import categoriesRouter from './routes/categories.routes.js'

const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(pinoHttp({ logger }))
app.use(cookieParser())

app.use('/seeds', express.static('seeds'))

app.use('/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/categories', categoriesRouter)

mountAdmin(app)

app.use(notFound)
app.use(errorHandler)

export default app
