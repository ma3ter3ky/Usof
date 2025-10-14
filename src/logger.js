import pino from 'pino'
import pinoHttp from 'pino-http'

export const logger = pino({
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.email',
      'res.headers.set-cookie'
    ],
    censor: '[REDACTED]'
  },
  level: process.env.LOG_LEVEL || 'info'
})

export const httpLogger = pinoHttp({
  logger,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.email',
      'res.headers.set-cookie'
    ],
    censor: '[REDACTED]'
  }
})
