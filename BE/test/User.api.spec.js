/* eslint-disable */

const request = require('supertest')
const app = require('../index')
const { UserCourse } = require('../models')
require('dotenv').config()

let token = null
let token2 = null
let notifications = null
let userModuleId = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token

    const loginResponse2 = await request(app).post('/api/v1/auth/login').send({
      email: 'aceng@admin.sinow.com',
      password: '12345678',
    })

    token2 = loginResponse2.body.data.token

    await request(app)
      .get('/api/v1/user/my-courses/1')
      .set({
        Authorization: `Bearer ${token2}`,
      })
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

afterAll(async () => {
  try {
    await UserCourse.destroy({
      where: {
        userId: 1,
      },
    })
  } catch (error) {
    console.log(error)
  }
})

describe('API get data user', () => {
  it('success get data user', async () => {
    const response = await request(app)
      .get('/api/v1/user')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get data user: no token', async () => {
    const response = await request(app).get('/api/v1/user')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API update data user', () => {
  const userData = {
    name: 'John Doe',
    country: 'Indonesia',
    city: 'Jakarta',
  }
  it('success update data user', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(userData)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed update data user: no token', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .field(userData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update data user: email resgisterd on another account', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field({ email: 'aceng@admin.sinow.com' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update data user: email is not valid', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field({ email: 'fadhlan.admin' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update data user: phone Number resgisterd on another account', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field({ phoneNumber: 81234567101 })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update data user: phone Number is not valid', async () => {
    const response = await request(app)
      .patch('/api/v1/user/update')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field({ phoneNumber: '812' })
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API change password user', () => {
  it('success change password user', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345678',
      confirmNewPassword: '12345678',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed change password user: no token', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345678',
      confirmNewPassword: '12345678',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .send(data)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: old password not valid', async () => {
    const data = {
      oldPassword: '123456789',
      newPassword: '12345678',
      confirmNewPassword: '12345678',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: new password does not match', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345678',
      confirmNewPassword: '1234567890',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: new password less than 8', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '12345',
      confirmNewPassword: '12345',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed change password user: new password more than 12', async () => {
    const data = {
      oldPassword: '12345678',
      newPassword: '123456789012345',
      confirmNewPassword: '123456789012345',
    }
    const response = await request(app)
      .patch('/api/v1/user/change-password')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(data)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get user notification', () => {
  it('success get user notification', async () => {
    const response = await request(app)
      .get('/api/v1/user/notifications')
      .set({
        Authorization: `Bearer ${token}`,
      })
    notifications = response.body.data
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get user notification: no token', async () => {
    const response = await request(app).get('/api/v1/user/notifications')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get notification details by id', () => {
  it('success get notification details by id', async () => {
    const response = await request(app)
      .get(
        `/api/v1/user/notifications/${
          notifications[notifications.length - 1].id
        }`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get notification details by id: no token', async () => {
    const response = await request(app).get(
      `/api/v1/user/notifications/${
        notifications[notifications.length - 1].id
      }`,
    )
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification details by id: notification not found', async () => {
    const response = await request(app)
      .get('/api/v1/user/notifications/999999')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed get notification details by id: no access', async () => {
    const response = await request(app)
      .get(`/api/v1/user/notifications/${notifications[0].id}`)
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API delete notification by id', () => {
  it('success delete notification by id', async () => {
    const response = await request(app)
      .delete(
        `/api/v1/user/notifications/${
          notifications[notifications.length - 1].id
        }`,
      )
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete notification by id: no token', async () => {
    const response = await request(app).delete(
      `/api/v1/user/notifications/${
        notifications[notifications.length - 1].id
      }`,
    )
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete notification by id: notification not found', async () => {
    const response = await request(app)
      .delete('/api/v1/user/notifications/999999')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed delete notification by id: no access', async () => {
    const response = await request(app)
      .delete(
        `/api/v1/user/notifications/${
          notifications[notifications.length - 1].id
        }`,
      )
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API create User Course', () => {
  it('success create user course', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses/1')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
  })

  it('failed create user course by id: no token', async () => {
    const response = await request(app).get('/api/v1/user/my-courses/1').send({
      courseId: 1,
    })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create user course by id: course not found', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses/999999')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API open User Course', () => {
  it('success open user course', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses/1')
      .set({
        Authorization: `Bearer ${token}`,
      })
    userModuleId =
      response.body.data.userCourse.Course.chapters[0].userModules[0].id
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
})

describe('API get all userCourses', () => {
  it('success get all user courses', async () => {
    const response = await request(app)
      .get('/api/v1/user/my-courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get all user courses: no token', async () => {
    const response = await request(app).get('/api/v1/user/my-courses')
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get userModule', () => {
  it('success get all user modules', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/1/modules/${userModuleId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
  it('failed get user module: no token', async () => {
    const response = await request(app).get(
      `/api/v1/user/my-courses/1/modules/${userModuleId}`,
    )
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
  it('failed get user module: token not valid', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/1/modules/${userModuleId}`)
      .set({
        Authorization: `Bearer ${token}12`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
  it('failed get user modules: no relation', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/1/modules/${userModuleId}`)
      .set({
        Authorization: `Bearer ${token2}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
  })
  it('failed get user module: course not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/99999999/modules/${userModuleId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed get user module: module not found', async () => {
    const response = await request(app)
      .get(`/api/v1/user/my-courses/99999999/modules/9191919`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed get user module: module is inaccessible', async () => {
    const coursePremium = await request(app)
      .get('/api/v1/user/my-courses/4')
      .set({
        Authorization: `Bearer ${token}`,
      })

    const modulePremiumId =
      coursePremium.body.data.userCourse.Course.chapters[0].userModules[1].id

    const response = await request(app)
      .get(`/api/v1/user/my-courses/4/modules/${modulePremiumId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(403)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Anda perlu menyelesaikan pembayaran terlebih dahulu untuk mengakses course ini',
    )
  })
})
