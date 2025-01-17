require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const errorController = require('./controllers/errorController')
const router = require('./routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(router)

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    return res.status(301).redirect(`/api-docs`)
  }
  return next()
})

app.all('*', (req, res) => res.status(404).json({
  status: 'Failed',
  message: `Halaman tidak ditemukan, silahkan cek dokumentasi ${process.env.BASE_URL}/api-docs/`,
}))

app.use(errorController)

module.exports = app
