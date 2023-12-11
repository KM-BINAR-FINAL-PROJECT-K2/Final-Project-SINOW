/* eslint-disable */

const request = require('supertest')
const app = require('../index')
const path = require('path')
require('dotenv').config()

let token = null
let moduleId = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'adella@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

const moduleData = {
  name: 'Introduction to HTML',
  no: 4,
  chapterId: 1,
}

const imagePath = path.join(__dirname, '../public/images/image.png')

const videoPath = path.join(__dirname, '../public/videos/video.mp4')

describe('API Get All Module Data', () => {
  it('success get module', async () => {
    const response = await request(app).get('/api/v1/modules')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mendapatkan data modules')
  })
})

describe('API Get Module by Id', () => {
  it('success get Module by id', async () => {
    const response = await request(app).get('/api/v1/modules/1')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mendapatkan data module id: 1')
  })

  it('failed get module by id', async () => {
    const response = await request(app).get('/api/v1/modules/2002')
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Module tidak ditemukan')
  })
})

describe('API Create Module', () => {
  it('success create module', async () => {
    const response = await request(app)
      .post('/api/v1/modules')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(moduleData)
      .attach('video', videoPath)

    moduleId = response.body.data.id
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil menambahkan data module')
  }, 20000)

  it('failed create module: data not valid (missing video file)', async () => {
    const response = await request(app)
      .post('/api/v1/modules')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(moduleData)
      .attach('video', '')
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Harus menyertakan video')
  })

  it('failed create module: invalid video format', async () => {
    const response = await request(app)
      .post('/api/v1/modules')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(moduleData)
      .attach('video', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Harus mengisi file video di kolom video',
    )
  })

  it('failed create module: duplikat name', async () => {
    const failModule = {
      name: 'video 1',
      no: 4,
      chapterId: 1,
    }

    const response = await request(app)
      .post('/api/v1/modules')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nama modul sudah ada dalam chapter ini')
  })

  it('failed create module: number isNaN', async () => {
    const failModule = {
      name: 'Introduction to HTML',
      no: 'empat',
      chapterId: 1,
    }

    const response = await request(app)
      .post('/api/v1/modules')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor dan chapterId harus berupa angka')
  })

  it('failed create module: chapter not found', async () => {
    const failModule = {
      name: 'Introduction to HTML',
      no: 4,
      chapterId: 12345,
    }

    const response = await request(app)
      .post(`/api/v1/modules`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Chapter tidak ditemukan, silahkan cek daftar chapter untuk melihat chapter yang tersedia',
    )
  })

  it('failed create module: chapter isNaN', async () => {
    const failModule = {
      name: 'Introduction to HTML',
      no: 4,
      chapterId: 'satu dua empat',
    }

    const response = await request(app)
      .post(`/api/v1/modules`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor dan chapterId harus berupa angka')
  })

  it('failed create module: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/modules')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(moduleData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})
describe('API Update Module', () => {
  it('success update module', async () => {
    const response = await request(app)
      .put('/api/v1/modules/2')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(moduleData)
      .attach('video', videoPath)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mengupdate data module id: 2')
  })

  it('failed update module: invalid video format', async () => {
    const response = await request(app)
      .put('/api/v1/modules/2')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .attach('video', imagePath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Harus mengisi file video di kolom video',
    )
  })

  it('failed update module: duplikat name', async () => {
    const failModule = {
      name: 'video 1',
      no: 4,
      chapterId: 1,
    }

    const response = await request(app)
      .put(`/api/v1/modules/${moduleId || 2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nama modul sudah ada dalam chapter ini')
  })

  it('failed update module: number isNaN', async () => {
    const failModule = {
      name: 'Introduction to HTML',
      no: 'empat',
      chapterId: 1,
    }

    const response = await request(app)
      .put(`/api/v1/modules/${moduleId || 2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Nomor modul harus berupa angka')
  })

  it('failed update module: chapter not found', async () => {
    const failModule = {
      name: 'Introduction to HTML',
      no: 4,
      chapterId: 12345,
    }

    const response = await request(app)
      .put(`/api/v1/modules/${moduleId || 2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Chapter tidak ditemukan, silahkan cek daftar chapter untuk melihat chapter yang tersedia',
    )
  })

  it('failed update module: chapter isNaN', async () => {
    const failModule = {
      name: 'Introduction to HTML',
      no: 4,
      chapterId: 'satu',
    }

    const response = await request(app)
      .put(`/api/v1/modules/${moduleId || 2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .field(failModule)
      .attach('video', videoPath)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Chapter ID harus berupa angka')
  })

  it('failed update module: token not valid', async () => {
    const response = await request(app)
      .put('/api/v1/modules/2')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .field(moduleData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Delete Module', () => {
  it('success delete module', async () => {
    const response = await request(app)
      .delete(`/api/v1/modules/${moduleId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete module: module not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/modules/919191`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed delete module: token not valid', async () => {
    const response = await request(app)
      .delete(`/api/v1/modules/${moduleId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})
