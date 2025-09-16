import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { logger } from './logger.js'

const app = express()

app.use(cors())
app.use(helmet())
app.use(compression())
app.use(express.json({ limit: '1mb' }))

app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, 'request')
  next()
})

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' })
})

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl })
})

app.use((err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error')
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

export default app
