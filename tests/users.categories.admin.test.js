import request from 'supertest'
import app from '../src/app.js'

let adminToken, userToken

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'admin123' })
  adminToken = adminRes.body.access

  const userRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', password: 'alice123' })
  userToken = userRes.body.access
})

describe('Users skeleton', () => {
  test('GET /api/users requires auth', async () => {
    const r1 = await request(app).get('/api/users')
    expect(r1.status).toBe(401)

    const r2 = await request(app).get('/api/users').set('Authorization', `Bearer ${userToken}`)
    expect(r2.status).toBe(200)
    expect(r2.body).toHaveProperty('message', 'List users - TBD')
  })

  test('POST /api/users admin-only', async () => {
    const rUser = await request(app).post('/api/users').set('Authorization', `Bearer ${userToken}`)
    expect(rUser.status).toBe(403)

    const rAdmin = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(rAdmin.status).toBe(200)
  })

  test('methodNotAllowed on POST /api/users/1', async () => {
    const r = await request(app).post('/api/users/1').set('Authorization', `Bearer ${adminToken}`)
    expect([405, 404]).toContain(r.status) // 405 preferred, 404 if route not matched
  })
})

describe('Categories skeleton', () => {
  test('GET /api/categories is public', async () => {
    const r = await request(app).get('/api/categories')
    expect(r.status).toBe(200)
    expect(r.body).toHaveProperty('message', 'List categories - TBD')
  })

  test('POST /api/categories admin-only', async () => {
    const rNo = await request(app).post('/api/categories')
    expect(rNo.status).toBe(401)

    const rUser = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${userToken}`)
    expect(rUser.status).toBe(403)

    const rAdmin = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(rAdmin.status).toBe(200)
  })
})

describe('AdminJS gate', () => {
  test('admin only', async () => {
    const rNo = await request(app).get('/admin')
    expect([401, 403]).toContain(rNo.status)

    const rUser = await request(app).get('/admin').set('Authorization', `Bearer ${userToken}`)
    expect(rUser.status).toBe(403)

    const rAdmin = await request(app).get('/admin').set('Authorization', `Bearer ${adminToken}`)
    expect(rAdmin.status).toBe(200) // AdminJS HTML
    expect(rAdmin.headers['content-type']).toMatch(/text\/html/i)
  })
})
