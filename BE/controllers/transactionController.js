const { Transaction, Course } = require('../models')
const Midtrans = require('midtrans-client')
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
    res.status(200).json({
      status: 'Success',
      message: 'sukses mengambil data purchase',
      data: transactions,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const createTransaction = async (req, res, next) => {
  try {
    const { courseId } = req.body
    const user = req.user

    if (!courseId) {
      return next(new ApiError('Course ID harus diisi', 400))
    }

    const checkTransaction = await Transaction.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    })

    if (checkTransaction) {
      return next(new ApiError("Anda sudah membeli course ini", 400));
    }

    const course = await Course.findByPk(courseId)

    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    if (course.type !== 'premium') {
      return next(new ApiError('Bukan course premium', 400))
    }

    const promoPrice = course.price - (course.price * course.promo) / 100
    const totalPrice = promoPrice + (promoPrice * 11) / 100

    const newTransaction = await Transaction.create({
      userId: user.id,
      courseId,
      coursePrice: totalPrice,
      totalPrice,
      promo: course.promo,
      status: 'BELUM BAYAR',
    })
    const parameter = {
      item_details: [
        {
          id: course.id,
          price: totalPrice,
          name: course.name,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: user.name,
        email: 'muhammadfadhlan0011@gmail.com',
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

    res.status(201).json({
      status: 'Success',
      message: 'sukses membuat transaksi',
      data: midtransResponseData,
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

    if(!transaction_status || !fraud_status || !order_id || !status_code || !gross_amount || !signature_key) {
      return next(new ApiError('Semua field harus diisi', 400))
    }

    const checkSignatureKey = generateSHA512(
      `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
    )

    if (signature_key !== checkSignatureKey) {
      return next(new ApiError('Signature key tidak sesuai', 400))
    }

    const transaction = await Transaction.findByPk(order_id)
    if (!transaction) {
      return next(new ApiError('Transaksi tidak ditemukan', 404))
    }

    if (transaction.status === 'SUDAH BAYAR') {
      return next(new ApiError('Transaksi sudah berhasil', 400))
    }

    if (transaction.status === 'GAGAL') {
      return next(new ApiError('Transaksi gagal', 400))
    }

    if (
      transaction_status === 'capture' ||
      transaction_status === 'settlement'
    ) {
      if (fraud_status === 'accept') {
        transaction.status = 'SUDAH BAYAR'
        await transaction.save()
      } else {
        transaction.status = 'GAGAL'
        await transaction.save()
      }
    }

    if (transaction_status === 'cancel' || transaction_status === 'deny') {
      transaction.status = 'failed'
      await transaction.save()
    }

    if (transaction_status === 'expire') {
      transaction.status = 'KADALUARSA'
      await transaction.save()
    }

    res.status(200).json({
      status: 'Success',
      message: 'Berhasil menyelesaikan transaksi',
      data: transaction,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  getAllTransaction,
  createTransaction,
  paymentFinalize,
}
