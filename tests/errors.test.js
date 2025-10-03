import request from 'supertest'
import app from '../src/app.js'

test('unknown route -> 404 json', async () => {
  const res = await request(app).get('/__nope__').expect(404)
  expect(res.body).toMatchObject({
    error: { code: 'NOT_FOUND' }
  })
})

test('POST /health -> 405', async () => {
  const res = await request(app).post('/health').expect(405)
  expect(res.body).toMatchObject({
    error: { code: 'METHOD_NOT_ALLOWED' }
  })
})
