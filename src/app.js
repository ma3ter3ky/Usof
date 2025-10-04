import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import pinoHttp from 'pino-http'
import { logger } from './logger.js'
import healthRouter from './routes/health.js'
import { notFound } from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'
import authRouter from './routes/auth.routes.js'

const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '1mb' }))
app.use(pinoHttp({ logger }))

app.use('/health', healthRouter)
app.use('/seeds', express.static('seeds'))
app.use('/api/auth', authRouter)

app.use(notFound)

app.use(errorHandler)

export default app
