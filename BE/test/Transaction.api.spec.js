/* eslint-disable */
const request = require('supertest')
const { Transaction } = require('../models')
const app = require('../index')
const generateSHA512 = require('../utils/generateSHA512')
require('dotenv').config()

let token = null
let course = null
let transaction = null

beforeAll(async () => {
  try {
    const loginResponse = await request(app).post('/api/v1/auth/login').send({
      email: 'fadhlan@admin.sinow.com',
      password: '12345678',
    })
    token = loginResponse.body.data.token

    const premiumCourseResponse = await request(app).get(
      '/api/v1/courses?type=premium',
    )

    if (premiumCourseResponse.body.data.length > 0) {
      course = premiumCourseResponse.body.data[0]
    }
  } catch (error) {
    console.log('error saat login: ')
    console.log(error)
  }
})

afterAll(async () => {
  try {
    await Transaction.destroy({
      where: {
        id: transaction.id,
      },
    })
  } catch (error) {
    console.log(error)
  }
})

describe('API create transaction', () => {
  it('success create transaction', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        courseId: course.id,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    console.log(response.req._header)
    console.log(response.body)
    transaction = response.body.data.transactionDetail

    expect(response.statusCode).toBe(201)
    expect(response.body.status).toBe('Success')
  })

  it('failed create transaction: course not found', async () => {
    const response = await request(app)
      .post('/api/v1/transactions')
      .send({
        courseId: 999999,
      })
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
  })
})

describe('API get all transaction', () => {
  it('success get all transaction', async () => {
    const response = await request(app)
      .get('/api/v1/transactions')
      .set({
        Authorization: `Bearer ${token}`,
      })
    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
})

describe('API get transaction by id', () => {
  it('success get detail transaction', async () => {
    const response = await request(app)
      .get(`/api/v1/transactions/${transaction.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
  })
})

describe('API finalize transaction', () => {
  it('failed finalize transaction: request body not valid', async () => {
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Semua field harus diisi')
  })

  it('failed finalize transaction: fraud status not accept', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'deny',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Transaksi gagal: terdeteksi sebagai fraud',
    )
  })

  it('failed finalize transaction: signature key not valid', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }1`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Signature key tidak sesuai')
  })

  it('failed finalize transaction: transaction not found', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: 22929022,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(404)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Transaksi tidak ditemukan')
  })

  it('failed finalize transaction: transaction expired', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'expire',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe(
      'Transaksi kadaluarsa, silahkan buat transaksi baru',
    )
  })

  it('failed finalize transaction: transaction status deny', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'deny',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Transaksi ditolak')
  })

  it('success finalize transaction', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Success')
    expect(response.body.message).toBe(
      'Berhasil menyelesaikan transaksi, course kini dapat diakses',
    )
  })

  it('failed finalize transaction: transaction paid', async () => {
    const signature_key = generateSHA512(
      `${transaction.id}${200}${transaction.totalPrice}${
        process.env.MIDTRANS_SERVER_KEY
      }`,
    )
    const response = await request(app)
      .post(`/api/v1/transactions/finalize`)
      .set({
        Authorization: `Bearer ${token}`,
      })
      .send({
        transaction_status: 'capture',
        fraud_status: 'accept',
        order_id: transaction.id,
        status_code: 200,
        gross_amount: transaction.totalPrice,
        signature_key,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.status).toBe('Failed')
    expect(response.body.message).toBe('Transaksi ini sudah dibayar')
  })
})
