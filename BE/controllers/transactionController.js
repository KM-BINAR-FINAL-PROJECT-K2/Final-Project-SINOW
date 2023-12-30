/* eslint-disable camelcase */

const Midtrans = require('midtrans-client')
const {
  Transaction,
  Course,
  UserCourse,
  UserModule,
  Category,
  Chapter,
  Module,
} = require('../models')

const { createNotification } = require('../utils/notificationUtils')
const ApiError = require('../utils/ApiError')
const generateSHA512 = require('../utils/generateSHA512')

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
})

const getAllTransaction = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: Course,
          include: [
            {
              model: Category,
              as: 'category',
            },
          ],
        },
      ],
    })

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
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Course,
          include: [
            {
              model: Category,
              as: 'category',
            },
          ],
        },
      ],
    })

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

    const checkTransaction = await Transaction.findOne({
      where: {
        userId: user.id,
        courseId,
      },
      include: [
        {
          model: Course,
          include: [
            {
              model: Category,
              as: 'category',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    if (checkTransaction) {
      if (checkTransaction.status === 'SUDAH_BAYAR') {
        return next(
          new ApiError('Anda sudah memiliki akses untuk course ini', 400),
        )
      }

      if (checkTransaction.status === 'BELUM_BAYAR') {
        return res.status(400).json({
          status: 'Failed',
          message: 'Transaksi sudah ada silahkan melakukan pembayaran',
          data: {
            transactionDetail: checkTransaction,
            paymentUrl: checkTransaction.paymentUrl,
          },
        })
      }
    }

    const checkUserCourse = await UserCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    })

    if (checkUserCourse) {
      if (checkUserCourse.isAccessible) {
        return next(
          new ApiError('Anda sudah memiliki akses untuk course ini', 400),
        )
      }
    }

    if (!checkUserCourse) {
      const createUserCourse = await UserCourse.create({
        userId: user.id,
        courseId,
        isAccessible: false,
        progress: 'inProgress',
        progressPercentage: 0,
        lastSeen: new Date(),
      })

      const userCourseBuffer = await UserCourse.findByPk(createUserCourse.id, {
        include: [
          {
            model: Course,
            include: [
              {
                model: Chapter,
                as: 'chapters',
                attributes: ['id', 'no', 'name'],
                include: [
                  {
                    model: Module,
                    as: 'modules',
                    attributes: ['id', 'no', 'name', 'videoUrl', 'duration'],
                  },
                ],
              },
            ],
          },
        ],
        order: [
          ['Course', 'chapters', 'no', 'ASC'],
          ['Course', 'chapters', 'modules', 'no', 'ASC'],
        ],
      })

      if (userCourseBuffer.Course.chapters.length > 0) {
        await Promise.all(
          userCourseBuffer.Course.chapters.map(
            async (chapter, chapterIndex) => {
              if (chapter.modules.length > 0) {
                await Promise.all(
                  chapter.modules.map(async (module, moduleIndex) => {
                    try {
                      await UserModule.create({
                        userId: user.id,
                        moduleId: module.id,
                        chapterId: chapter.id,
                        status:
                          (module.no === 1
                            && (chapter.no === 1 || chapterIndex === 0))
                          || (moduleIndex === 0 && chapterIndex === 0)
                            ? 'terbuka'
                            : 'terkunci',
                      })
                    } catch (error) {
                      throw next(new ApiError(error.message, 500))
                    }
                  }),
                )
              }
            },
          ),
        )
      }
    }

    const discountPrice = (course.price * course.promoDiscountPercentage) / 100
    const taxPrice = discountPrice === 0
      ? (course.price * 11) / 100
      : (discountPrice * 11) / 100

    const totalPrice = course.price - discountPrice + taxPrice

    const timestamp = new Date().getTime()
    const userSalt = Math.floor(Math.random() * 1000)
    const combinedValue = `${timestamp}${user.id}${userSalt}${courseId}`
    const noOrder = parseInt(combinedValue / 123, 10).toString(16)

    const newTransaction = await Transaction.create({
      noOrder,
      userId: user.id,
      courseId,
      coursePrice: course.price,
      discountPrice,
      taxPrice,
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

    await createNotification(
      'Transaksi',
      'Transaksi berhasil dibuat',
      user.id,
      `Yeay! Transaksi untuk course ${course.name} telah dibuat. Tinggal selangkah lagi agar kamu dapat memulai pembelajaran di course ${course.name}.\n\nUntuk menyelesaikan transaksi, kamu dapat menggunakan link berikut ini:\n${midtransResponseData.redirect_url}`,
      next,
    )

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

    const transaction = await Transaction.findByPk(order_id, {
      include: [
        {
          model: Course,
          include: [
            {
              model: Category,
              as: 'category',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    })

    if (!transaction) {
      return res.status(404).json({
        status: 'Failed',
        message: 'Transaksi tidak ditemukan',
      })
    }

    if (transaction.status === 'SUDAH_BAYAR') {
      return res.status(200).json({
        status: 'Success',
        message: 'Transaksi sudah dibayar',
      })
    }

    if (transaction.status === 'DIBATALKAN') {
      return res.status(200).json({
        status: 'Success',
        message: 'Transaksi ini sudah dibatalkan',
      })
    }

    if (transaction.status === 'KADALUARSA') {
      return res.status(200).json({
        status: 'Success',
        message: 'Transaksi ini sudah kadaluarsa',
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
          isFollowing: true,
        })

        await transaction.update({
          status: 'SUDAH_BAYAR',
          paidAt: new Date(),
          paymentMethod: payment_type,
        })

        await createNotification(
          'Transaksi',
          'Transaksi sukses',
          transaction.userId,
          `Yeay! Transaksi untuk course ${transaction.Course.name} telah selesai. Sekarang kamu sudah bisa mengakses course ${transaction.Course.name}.`,
        )
      } else {
        transaction.status = 'GAGAL'
        await transaction.save()
        return res.status(200).json({
          status: 'Success',
          message: 'Transaksi gagal: terdeteksi sebagai fraud',
        })
      }
    }

    if (transaction_status === 'cancel') {
      transaction.status = 'DIBATALKAN'
      await transaction.save()
      return res.status(200).json({
        status: 'Success',
        message: 'Transaksi dibatalkan',
      })
    }

    if (transaction_status === 'deny') {
      transaction.status = 'DITOLAK'
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
