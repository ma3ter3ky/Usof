import request from 'supertest'
import app from '../src/app.js'

let adminAccess, userAccess, userId

beforeAll(async () => {
  const admin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'admin123' })
  adminAccess = admin.body.access

  const user = await request(app)
    .post('/api/auth/login')
    .send({ email: 'alice@example.com', password: 'alice123' })
  userAccess = user.body.access

  const list = await request(app).get('/api/users').set('Authorization', `Bearer ${adminAccess}`)
  userId = list.body.rows.find(u => u.email === 'alice@example.com')?.id || 2
})

describe('Users list/get', () => {
  test('GET /api/users requires auth', async () => {
    const r = await request(app).get('/api/users')
    expect(r.status).toBe(401)
  })

  test('GET /api/users returns pagination and rows', async () => {
    const r = await request(app)
      .get('/api/users?page=1&limit=10&sort=created_at:desc')
      .set('Authorization', `Bearer ${adminAccess}`)
    expect(r.status).toBe(200)
    expect(Array.isArray(r.body.rows)).toBe(true)
    expect(r.body.rows[0]).not.toHaveProperty('password_hash')
  })

  test('GET /api/users/:id returns user (no password_hash)', async () => {
    const r = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userAccess}`)
    expect(r.status).toBe(200)
    expect(r.body).not.toHaveProperty('password_hash')
  })
})

describe('Users create/update/delete with ACL', () => {
  test('POST /api/users forbidden for regular user', async () => {
    const r = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${userAccess}`)
      .send({
        login: 'newguy',
        full_name: 'New Guy',
        email: 'newguy@example.com',
        password: 'passpass123'
      })
    expect(r.status).toBe(403)
  })

  test('POST /api/users allowed for admin', async () => {
    const r = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccess}`)
      .send({
        login: 'newguy',
        full_name: 'New Guy',
        email: 'newguy@example.com',
        password: 'passpass123',
        role: 'user'
      })
    expect([201, 200]).toContain(r.status)
    expect(r.body).toHaveProperty('id')
  })

  test('PATCH /api/users/:id self can change only full_name/profile_picture', async () => {
    const r1 = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userAccess}`)
      .send({ full_name: 'Alice Updated' })
    expect(r1.status).toBe(200)

    const r2 = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userAccess}`)
      .send({ role: 'admin' })
    expect([403, 400]).toContain(r2.status)
  })

  test('PATCH /api/users/:id as admin can change role', async () => {
    const r = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminAccess}`)
      .send({ role: 'user' })
    expect(r.status).toBe(200)
  })

  test('DELETE /api/users/:id admin only', async () => {
    // create temp user to delete
    const created = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminAccess}`)
      .send({
        login: 'todel',
        full_name: 'To Delete',
        email: 'todel@example.com',
        password: 'passpass123'
      })
    const toDel = created.body.id

    const asUser = await request(app)
      .delete(`/api/users/${toDel}`)
      .set('Authorization', `Bearer ${userAccess}`)
    expect(asUser.status).toBe(403)

    const asAdmin = await request(app)
      .delete(`/api/users/${toDel}`)
      .set('Authorization', `Bearer ${adminAccess}`)
    expect([204, 200]).toContain(asAdmin.status)
  })
})
