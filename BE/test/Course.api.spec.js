/* eslint-disable */

const request = require('supertest')
const app = require('../index')
const path = require('path')
require('dotenv').config()

let token = null
let courseId = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

const course = {
  name: 'Fullstack Web Development',
  level: 'advanced',
  rating: 4,
  categoryId: 1,
  description: 'Testing',
  classCode: 'FSW123',
  type: 'gratis',
  price: 0,
  promo: 0,
  courseBy: 'John Doe',
}

const imagePath = path.join(__dirname, '../public/images/image.png')

const videoPath = path.join(__dirname, '../public/videos/video.mp4')

describe('API Get All Course Data', () => {
  it('success get course', async () => {
    const response = await request(app).get('/api/v1/courses')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get course: no course data', async () => {
    const response = await request(app).get('/api/v1/courses?search=sdfasdfas')
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Get Course by Id', () => {
  it('success get course by id', async () => {
    const response = await request(app).get('/api/v1/courses/1')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed get course by id', async () => {
    const response = await request(app).get('/api/v1/courses/919191')
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Create Course', () => {
  it('success create course', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
      .attach('image', imagePath)
      .attach('video', videoPath)
    courseId = response.body.data.id
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
  }, 20000)

  it('failed create course: image not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
      .attach('image', videoPath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: video not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
      .attach('image', imagePath)
      .attach('video', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: price = 0 on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 0,
      promo: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: price isNaN on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 'not a number',
      promo: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: promo is not beetween 0 and 100', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 10000,
      promo: 10000,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: level tidak valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'level tidak valid',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 10000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: rating is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 100,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: rating isNaN', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 'isNaN',
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: category not found', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: 19191919,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: categoryId isNaN', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: 'isNaN',
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: type not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: 'isNaN',
      description: 'Testing',
      classCode: 'FSW123',
      type: 'akwoakwao',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .post(`/api/v1/courses`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed create course: course data not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
  it('failed create course: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/courses')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(course)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Update Course', () => {
  it('success update course', async () => {
    const response = await request(app)
      .put('/api/v1/courses/1')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
  it('failed update course: course not found', async () => {
    const response = await request(app)
      .put('/api/v1/courses/91919203')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: image not valid', async () => {
    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
      .attach('image', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: price = 0 on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 0,
      promo: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: price isNaN on premium course', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 'not a number',
      promo: 0,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: promo is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'advanced',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10000,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: level is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'level tidak valid',
      rating: 4,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: rating is not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 100,
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: rating isNaN', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 'isNaN',
      categoryId: 1,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: category not found', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: 19191919,
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: categoryId isNaN', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: 'isNaN',
      description: 'Testing',
      classCode: 'FSW123',
      type: 'premium',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: type not valid', async () => {
    const failCourse = {
      name: 'Fullstack Web Development',
      level: 'beginner',
      rating: 3.5,
      categoryId: 'isNaN',
      description: 'Testing',
      classCode: 'FSW123',
      type: 'akwoakwao',
      price: 20000,
      promo: 10,
      courseBy: 'John Doe',
    }

    const response = await request(app)
      .put(`/api/v1/courses/${courseId || 1}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failCourse)
      .attach('image', imagePath)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })

  it('failed update course: video not valid', async () => {
    const response = await request(app)
      .put('/api/v1/courses/1')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(course)
      .attach('video', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
  })
  it('failed update course: token not valid', async () => {
    const response = await request(app)
      .put('/api/v1/courses/1')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(course)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Delete Course', () => {
  it('success delete course', async () => {
    const response = await request(app)
      .delete(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete course: course not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/courses/919191`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed delete course: token not valid', async () => {
    const response = await request(app)
      .delete(`/api/v1/courses/${courseId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})
