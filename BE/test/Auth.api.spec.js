/* eslint-disable */
const request = require('supertest')
const app = require('../app/index')
require('dotenv').config()

describe('API Register', () => {
  it('success register', async () => {
    const user = {
      email: 'imamtaufiq133@gmail.com',
      password: '12345678',
      name: 'imam',
      phoneNumber: '01234567'
    }
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(user)
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Registrasi berhasil & OTP berhasil dikirim ke email anda, silahkan verifikasi OTP sebelum login')
  })
})
