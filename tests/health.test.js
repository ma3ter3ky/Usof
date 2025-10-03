import request from 'supertest'
import app from '../src/app.js'

describe('GET /health', () => {
  it('returns 200 with status ok and db up', async () => {
    const res = await request(app).get('/health').expect(200)
    expect(res.body).toMatchObject({ status: 'ok', db: 'up' })
    expect(typeof res.body.version).toBe('string')
  })
})
