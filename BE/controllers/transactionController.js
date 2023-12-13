/* eslint-disable camelcase */

const Midtrans = require('midtrans-client')
const { Transaction, Course, UserCourse } = require('../models')
const ApiError = require('../utils/ApiError')
const generateSHA512 = require('../utils/generateSHA512')

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
})

const getAllTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll()

    if (!transactions || transactions.length === 0) {
      return next(new ApiError('Data transaction masih kosong', 404))
    }
    return res.status(200).json({
      status: 'Success',
      message: 'sukses mengambil data purchase',
      data: transactions,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params
    const transaction = await Transaction.findByPk(id)

    if (!transaction) {
      return next(new ApiError('Data transaction tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'sukses mengambil data transaksi',
      data: transaction,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const createTransaction = async (req, res, next) => {
  try {
    const { courseId } = req.body
    const { user } = req

    if (!courseId) {
      return next(new ApiError('Course ID harus diisi', 400))
    }

    const course = await Course.findByPk(courseId)

    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    if (course.type !== 'premium') {
      return next(new ApiError('Bukan course premium', 400))
    }

    const [checkUserCourse] = await UserCourse.findOrCreate({
      where: {
        userId: user.id,
        courseId,
      },
      defaults: {
        userId: user.id,
        courseId,
        isAccessible: false,
        progress: 0,
        lastSeen: new Date(),
      },
    })

    if (checkUserCourse.isAccessible) {
      return next(
        new ApiError('Anda sudah memiliki akses untuk course ini', 400),
      )
    }

    const checkTransaction = await Transaction.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    })

    if (checkTransaction) {
      return next(new ApiError('Sudah ada transaksi untuk course ini', 400))
    }

    const promoPrice = course.price - (course.price * course.promo) / 100
    const totalPrice = promoPrice + (promoPrice * 11) / 100

    const newTransaction = await Transaction.create({
      userId: user.id,
      courseId,
      coursePrice: course.price,
      totalPrice,
      promo: course.promo,
      status: 'BELUM BAYAR',
    })

    const courseName = course.name.length > 30
      ? `${course.name.substring(0, 30)}...`
      : course.name

    const parameter = {
      item_details: [
        {
          id: course.id,
          price: totalPrice,
          name: courseName,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: user.name,
        email: user.email,
        phone: user.Auth.phoneNumber,
        customer_details_required_fields: ['first_name', 'phone', 'email'],
      },
      transaction_details: {
        order_id: newTransaction.id,
        gross_amount: totalPrice,
      },
      usage_limit: 1,
    }

    const midtransResponseData = await snap.createTransaction(parameter)

    return res.status(201).json({
      status: 'Success',
      message: 'sukses membuat transaksi',
      data: {
        ...midtransResponseData,
        transactionDetail: newTransaction,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const paymentFinalize = async (req, res, next) => {
  try {
    const {
      transaction_status,
      fraud_status,
      order_id,
      status_code,
      gross_amount,
      signature_key,
    } = req.body

    if (
      !transaction_status
      || !fraud_status
      || !order_id
      || !status_code
      || !gross_amount
      || !signature_key
    ) {
      return next(new ApiError('Semua field harus diisi', 400))
    }

    const transaction = await Transaction.findByPk(order_id)
    if (!transaction) {
      return next(new ApiError('Transaksi tidak ditemukan', 404))
    }

    if (transaction_status === 'expire') {
      transaction.status = 'KADALUARSA'
      await transaction.save()

      return next(
        new ApiError('Transaksi kadaluarsa, silahkan buat transaksi baru', 400),
      )
    }

    const checkSignatureKey = generateSHA512(
      `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
    )

    if (signature_key !== checkSignatureKey) {
      return next(new ApiError('Signature key tidak sesuai', 400))
    }

    if (transaction.status === 'SUDAH BAYAR') {
      return next(new ApiError('Transaksi ini sudah dibayar', 400))
    }

    if (
      transaction_status === 'capture'
      || transaction_status === 'settlement'
    ) {
      if (fraud_status === 'accept') {
        transaction.status = 'SUDAH BAYAR'
        await transaction.save()
      } else {
        transaction.status = 'GAGAL'
        await transaction.save()
        return next(
          new ApiError('Transaksi gagal: terdeteksi sebagai fraud', 400),
        )
      }
    }

    if (transaction_status === 'cancel' || transaction_status === 'deny') {
      transaction.status = 'failed'
      await transaction.save()
      return next(new ApiError('Transaksi ditolak', 400))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil menyelesaikan transaksi, course kini dapat diakses',
      data: transaction,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  getAllTransaction,
  getTransactionById,
  createTransaction,
  paymentFinalize,
}
