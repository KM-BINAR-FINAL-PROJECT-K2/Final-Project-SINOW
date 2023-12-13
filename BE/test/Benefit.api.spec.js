/* eslint-disable */

const request = require('supertest')
const app = require('../index')
require('dotenv').config()

let token = null
let benefitId = null

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

const benefitData = {
  description:
    'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya.',
  courseId: 1,
}

describe('API Get All Benefit Data', () => {
  it('success get benefit', async () => {
    const response = await request(app).get('/api/v1/benefits')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mendapatkan data benefit')
  })
})

describe('API Get benefit by Id', () => {
  it('success get benefit by id', async () => {
    const response = await request(app).get('/api/v1/benefits/1')
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Berhasil mendapatkan data Benefit id: 1',
    )
  })

  it('failed get benefit by id', async () => {
    const response = await request(app).get('/api/v1/benefits/2002')
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Benefit tidak ditemukan')
  })
})

describe('API Create Benefit', () => {
  it('success create benefit', async () => {
    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(benefitData)

    benefitId = response.body.data.id
    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil menambahkan data benefit')
  }, 20000)

  it('failed create benefit: missing field', async () => {
    const failBenefit = {}

    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Field description, courseId harus di isi',
    )
  })
  it('failed create benefit: duplicate description', async () => {
    const failBenefit = {
      description:
        'Kursus ramah pemula untuk belajar pengembangan web dengan React JS tanpa perlu latar belakang IT.',
      courseId: 1,
    }

    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Benefit sudah ada')
  })

  it('failed create benefit: Course ID isNaN', async () => {
    const failBenefit = {
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya',
      courseId: 'satu',
    }

    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Course ID harus berupa angka')
  })

  it('failed create benefit: course not found', async () => {
    const failBenefit = {
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya',
      courseId: 10000,
    }
    const response = await request(app)
      .post(`/api/v1/benefits`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia',
    )
  })

  it('failed create benefit: token not valid', async () => {
    const response = await request(app)
      .post('/api/v1/benefits')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .send(benefitData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})
describe('API Update benefit', () => {
  it('success update benefit', async () => {
    const benefitData = {
      description:
        'Fleksibel. cukup menggunakan internet agar bisa belajar, kita bisa mengatur waktu, bebas kapan harus belajar, dan di mana pun anda berada.',
      courseId: 1,
    }
    const response = await request(app)
      .put('/api/v1/benefits/2')
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(benefitData)

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe('Berhasil mengupdate data benefit id: 2')
  })

  it('failed update benefit: duplicate decription', async () => {
    const failBenefit = {
      description:
        'Kursus ramah pemula untuk belajar pengembangan web dengan React JS tanpa perlu latar belakang IT.',
      courseId: 1,
    }

    const response = await request(app)
      .put(`/api/v1/benefits/${benefitId || 2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Benefit sudah ada dalam course ini')
  })

  it('failed update benefit: course not found', async () => {
    const failBenefit = {
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya.',
      courseId: 10000,
    }

    const response = await request(app)
      .put(`/api/v1/benefits/${benefitId || 2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Kursus tidak tersedia, silahkan cek daftar kursus untuk melihat kursus yang tersedia',
    )
  })

  it('failed update benefit: course ID isNaN', async () => {
    const failBenefit = {
      description:
        'Bisa Mengikuti Real Project untuk Membangun Portofolio sebanyak-banyaknya.',
      courseId: 'seribu',
    }

    const response = await request(app)
      .put(`/api/v1/benefits/${benefitId || 2}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send(failBenefit)
    expect(response.statusCode).toBe(400)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Course ID harus berupa angka')
  })

  it('failed update benefit: token not valid', async () => {
    const response = await request(app)
      .put('/api/v1/benefits/2')
      .set({
        Authorization: `Bearer ${token}123`,
      })
      .send(benefitData)
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API Delete benefit', () => {
  it('success delete benefit', async () => {
    const response = await request(app)
      .delete(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })

  it('failed delete benefit: benefit not found', async () => {
    const response = await request(app)
      .delete(`/api/v1/benefits/919191`)
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
  it('failed delete benefit: token not valid', async () => {
    const response = await request(app)
      .delete(`/api/v1/benefits/${benefitId}`)
      .set({
        Authorization: `Bearer ${token}123`,
      })
    expect(response.statusCode).toBe(401)
    expect(response.body.status).toBe('Failed')
  })
})
