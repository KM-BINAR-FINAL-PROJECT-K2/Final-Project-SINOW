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
        progress: 'inProgress',
        progressPercentage: 0,
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
      if (checkTransaction.status === 'SUDAH_BAYAR') {
        return next(new ApiError('Anda sudah melakukan transaksi', 400))
      }
      if (checkTransaction.status === 'BELUM_BAYAR') {
        if (checkTransaction.expiredAt < new Date()) {
          await checkTransaction.update({
            status: 'KADALUARSA',
          })
          return next(
            new ApiError(
              'Transaksi sudah kadaluarsa, silahkan buat ulang transaksi',
              400,
            ),
          )
        }

        return res.status(400).json({
          status: 'Failed',
          message: 'Transaksi sudah ada silahkan melakukan pembayaran',
          data: {
            transactionDetail: checkTransaction,
            paymentUrl: checkTransaction.paymentUrl,
          },
        })
      }
      if (checkTransaction.status === 'KADALUARSA') {
        return next(
          new ApiError(
            'Transaksi sudah kadaluarsa, silahkan buat ulang transaksi',
            400,
          ),
        )
      }
    }

    const promoPrice = course.price - (course.price * course.promoDiscountPercentage) / 100

    const totalPrice = promoPrice + (promoPrice * 11) / 100

    const newTransaction = await Transaction.create({
      userId: user.id,
      courseId,
      coursePrice: course.price,
      totalPrice,
      promoDiscountPercentage: course.promoDiscountPercentage,
      taxPercentage: 11,
      paymentMethod: null,
      status: 'BELUM_BAYAR',
      paidAt: null,
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
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
        email: user.Auth.email,
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

    if (!midtransResponseData) {
      newTransaction.destroy()

      return next(new ApiError('Gagal membuat transaksi', 500))
    }

    await newTransaction.update({
      paymentUrl: midtransResponseData.redirect_url,
    })

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

const paymentCallback = async (req, res, next) => {
  try {
    const {
      transaction_status,
      fraud_status,
      order_id,
      status_code,
      gross_amount,
      signature_key,
      payment_type,
    } = req.body

    if (
      !transaction_status
      || !fraud_status
      || !order_id
      || !status_code
      || !gross_amount
      || !signature_key
    ) {
      return res.status(400).json({
        status: 'Failed',
        message: 'Semua field harus diisi',
      })
    }

    const transaction = await Transaction.findByPk(order_id)

    if (!transaction) {
      return res.status(404).json({
        status: 'Failed',
        message: 'Transaksi tidak ditemukan',
      })
    }

    if (transaction_status === 'expire') {
      transaction.status = 'KADALUARSA'
      await transaction.save()

      return res.status(200).json({
        status: 'Success',
        message: 'Transaksi kadaluarsa, silahkan buat transaksi baru',
      })
    }

    const checkSignatureKey = generateSHA512(
      `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
    )

    if (signature_key !== checkSignatureKey) {
      return res.status(200).json({
        status: 'Success',
        message: 'Signature key tidak sesuai',
      })
    }

    if (transaction.status === 'SUDAH_BAYAR') {
      return res.status(200).json({
        status: 'Success',
        message: 'Transaksi sudah dibayar',
      })
    }

    if (
      transaction_status === 'capture'
      || transaction_status === 'settlement'
    ) {
      if (fraud_status === 'accept') {
        const userCourse = await UserCourse.findOne({
          where: {
            userId: transaction.userId,
            courseId: transaction.courseId,
          },
        })

        await userCourse.update({
          isAccessible: true,
        })

        await transaction.update({
          status: 'SUDAH_BAYAR',
          paidAt: new Date(),
          paymentMethod: payment_type,
        })
      } else {
        transaction.status = 'GAGAL'
        await transaction.save()
        return res.status(200).json({
          status: 'Success',
          message: 'Transaksi gagal: terdeteksi sebagai fraud',
        })
      }
    }

    if (transaction_status === 'cancel' || transaction_status === 'deny') {
      transaction.status = 'GAGAL'
      await transaction.save()
      return res.status(200).json({
        status: 'Success',
        message: 'Transaksi ditolak',
      })
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
  paymentCallback,
}
