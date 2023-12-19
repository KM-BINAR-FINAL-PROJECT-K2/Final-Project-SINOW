const validator = require('validator')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const {
  User,
  Auth,
  Course,
  UserCourse,
  Module,
  Category,
  Benefit,
  Chapter,
  Notification,
  UserModule,
  Transaction,
} = require('../models')
const ApiError = require('../utils/ApiError')
const { createNotification } = require('../utils/notificationUtils')
const { createToken } = require('../utils/jwtUtils')
const {
  validateCategory,
  validateLevel,
  validateType,
  validateProgress,
} = require('../utils/courseValidator')

const { uploadImage } = require('../utils/imagekitUploader')

const userCourseRelation = (id) => {
  const data = {
    include: [
      {
        model: Course,
        include: [
          {
            model: Category,
            attributes: ['id', 'name'],
            as: 'category',
          },
          {
            model: User,
            as: 'courseCreator',
            attributes: ['id', 'name'],
          },
          {
            model: Benefit,
            as: 'benefits',
            attributes: ['id', 'description'],
          },
          {
            model: Chapter,
            as: 'chapters',
            attributes: ['id', 'no', 'name', 'totalDuration'],
            include: [
              {
                model: UserModule,
                as: 'userModules',
                attributes: ['id', 'status'],
                where: {
                  userId: id,
                },
                include: [
                  {
                    model: Module,
                    as: 'moduleData',
                    attributes: ['id', 'no', 'name'],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    order: [
      ['Course', 'id', 'ASC'],
      ['Course', 'chapters', 'no', 'ASC'],
      ['Course', 'chapters', 'userModules', 'moduleData', 'no', 'ASC'],
    ],
  }
  return data
}

const myDetails = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil detail user',
      data: req.user,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const updateMyDetails = async (req, res, next) => {
  try {
    const { name, country, city } = req.body
    let { email, phoneNumber } = req.body
    const { user } = req
    const { id } = user

    const updateDataUser = {}

    if (name && name !== '') {
      updateDataUser.name = name
    }

    if (country) {
      updateDataUser.country = country
    }

    if (city) {
      updateDataUser.city = city
    }

    if (req.file) {
      const { imageUrl } = await uploadImage(req.file, next)
      updateDataUser.photoProfileUrl = imageUrl
    }

    const updateDataAuth = {}

    if (email) {
      email = email.toLowerCase()
      if (!validator.isEmail(email)) {
        return next(new ApiError('Email tidak valid', 400))
      }
      if (email !== user.Auth.email) {
        const isEmailExist = await Auth.findOne({ where: { email } })
        if (isEmailExist) {
          return next(new ApiError('Email sudah terdaftar di lain akun', 400))
        }
      }
      updateDataAuth.email = email
    }

    if (phoneNumber) {
      if (`${phoneNumber}`.startsWith('0')) {
        phoneNumber = `${phoneNumber.slice(1)}`
      }
      if (!validator.isMobilePhone(`0${phoneNumber}`, 'id-ID')) {
        return next(new ApiError('Nomor telepon tidak valid', 400))
      }

      if (phoneNumber !== user.Auth.phoneNumber) {
        const isPhoneNumberExist = await Auth.findOne({
          where: { phoneNumber },
        })
        if (isPhoneNumberExist) {
          return next(
            new ApiError('Nomor telepon sudah terdaftar di akun lain', 400),
          )
        }
        updateDataAuth.phoneNumber = phoneNumber
      }
    }

    if (Object.keys(updateDataUser).length !== 0) {
      await User.update(updateDataUser, {
        where: {
          id,
        },
        returning: true,
      })
    }

    if (updateDataAuth.email || updateDataAuth.phoneNumber) {
      await Auth.update(updateDataAuth, {
        where: {
          id: user.Auth.id,
        },
        returning: true,
      })
    }

    const newUser = await User.findByPk(id, {
      include: ['Auth'],
    })

    req.user = newUser

    const token = createToken(
      { id: newUser.id, name: newUser.name, role: newUser.role },
      next,
    )

    await createNotification(
      'Notifikasi',
      'Berhasil memperbarui detail akun',
      newUser.id,
      'Detail akun Anda berhasil diperbarui',
      next,
    )

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data user id: ${newUser.id}`,
      data: {
        token,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const changeMyPassword = async (req, res, next) => {
  try {
    const { user } = req

    const { oldPassword, newPassword, confirmNewPassword } = req.body

    const auth = await Auth.findOne({
      where: {
        userId: user.id,
      },
    })

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return next(
        new ApiError(
          'Password lama, password baru, dan konfirmasi password baru harus diisi',
          400,
        ),
      )
    }

    if (newPassword.length < 8) {
      return next(new ApiError('Password min 8 karakter!', 400))
    }
    if (newPassword.length > 12) {
      return next(new ApiError('Password max 12 karakter!', 400))
    }
    if (newPassword !== confirmNewPassword) {
      return next(new ApiError('Password tidak cocok', 400))
    }

    const isMatch = await bcrypt.compare(oldPassword, auth.password)

    if (!isMatch) {
      return next(new ApiError('Password lama salah', 400))
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await auth.update({
      password: hashedPassword,
    })

    await createNotification(
      'Notifikasi',
      'Password Berhasil Diubah',
      user.id,
      `Halo ${user.name},\n\nPassword akun Anda telah diubah. Jika Anda merasa tidak melakukan perubahan ini, segera hubungi dukungan pelanggan kami.\n\nTerima kasih,\nTim SINOW 🫡`,
      next,
    )
    return res.status(200).json({
      status: 'Success',
      message: `Password berhasil diubah `,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getUserNotification = async (req, res, next) => {
  try {
    const userNotifications = await Notification.findAll({
      where: {
        userId: req.user.id,
      },
      order: [['createdAt', 'DESC']],
    })

    if (userNotifications.length === 0 || !userNotifications) {
      return next(new ApiError('Tidak ada notifikasi', 404))
    }

    return res.status(200).json({
      status: 'Success',
      data: userNotifications,
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

const openNotification = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const notification = await Notification.findByPk(id)
    if (!notification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }
    if (notification.userId !== userId) {
      return next(new ApiError('Akses ditolak', 403))
    }

    notification.update({
      isRead: true,
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil membuka notifikasi',
      data: notification,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const notification = await Notification.findByPk(id)
    if (!notification) {
      return next(new ApiError('Notifikasi tidak ditemukan', 404))
    }

    if (notification.userId !== userId) {
      return next(new ApiError('Akses ditolak', 403))
    }

    notification.destroy()

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus notifikasi dengan id: ${id}`,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getMyCourses = async (req, res, next) => {
  try {
    const { user } = req

    const {
      search, category, level, type, progress,
    } = req.query
    const where = {}

    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`,
      }
    }

    if (category) {
      validateCategory(category, next)
      if (Array.isArray(category)) {
        where.categoryId = {
          [Op.in]: category.map((cat) => parseInt(cat, 10)),
        }
      } else {
        where.categoryId = parseInt(category, 10)
      }
    }

    if (level) {
      validateLevel(level, next)
      where.level = {
        [Op.in]: Array.isArray(level) ? level : [level],
      }
    }

    if (type) {
      validateType(type, next)
      where.type = type
    }

    if (progress) {
      validateProgress(progress, next)
    }

    const course = await UserCourse.findAll({
      where: {
        userId: user.id,
        isAccessible: true,
        isFollowing: true,
        progress: progress || { [Op.ne]: null },
      },
      include: [
        {
          model: Course,
          where,
          include: [
            {
              model: Category,
              attributes: ['id', 'name'],
              as: 'category',
            },
          ],
        },
      ],
      order: [['lastSeen', 'DESC']],
    })

    if (!course || course.length === 0) {
      return next(new ApiError('Data course masih kosong', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil data course',
      data: course,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const openCourse = async (req, res, next) => {
  try {
    const { user } = req
    const { courseId } = req.params

    if (!courseId) {
      return next(new ApiError('courseId harus diisi', 400))
    }

    const course = await Course.findByPk(courseId)

    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    const userCourse = await UserCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
      include: userCourseRelation(user.id).include,
      order: userCourseRelation(user.id).order,
    })

    if (userCourse) {
      await userCourse.update({
        lastSeen: new Date(),
      })

      return res.status(200).json({
        status: 'Success',
        message: 'Berhasil mendapatkan detail course user',
        data: {
          userCourse,
        },
      })
    }

    const createUserCourse = await UserCourse.create({
      userId: user.id,
      courseId,
      isAccessible: course.type === 'gratis',
      isFollowing: false,
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
    })

    if (userCourseBuffer.Course.chapters.length > 0) {
      await Promise.all(
        userCourseBuffer.Course.chapters.map(async (chapter, chapterIndex) => {
          if (chapter.modules.length > 0) {
            await Promise.all(
              chapter.modules.map(async (module, moduleIndex) => {
                try {
                  await UserModule.create({
                    userId: user.id,
                    moduleId: module.id,
                    chapterId: chapter.id,
                    status:
                      moduleIndex === 0 && chapterIndex === 0
                        ? 'terbuka'
                        : 'terkunci',
                  })
                } catch (error) {
                  throw next(new ApiError(error.message, 500))
                }
              }),
            )
          }
        }),
      )
    }

    const newUserCourse = await UserCourse.findByPk(createUserCourse.id, {
      include: userCourseRelation(user.id).include,
      order: userCourseRelation(user.id).order,
    })

    return res.status(201).json({
      status: 'Success',
      message: 'Berhasil mengikuti course',
      data: {
        userCourse: newUserCourse,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const followCourse = async (req, res, next) => {
  try {
    const { user } = req
    const { courseId } = req.params

    if (!courseId) {
      return next(new ApiError('courseId harus diisi', 400))
    }

    const course = await Course.findByPk(courseId)

    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    const userCourse = await UserCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
    })

    if (!userCourse) {
      return next(new ApiError('User Course tidak ditemukan', 404))
    }

    if (!userCourse.isAccessible) {
      return next(
        new ApiError(
          'Course ini adalah course premium, silahkan beli course premium terlebih dahulu',
          400,
        ),
      )
    }

    if (userCourse.isFollowing) {
      return next(new ApiError('Anda sudah mengikuti course ini', 400))
    }

    await userCourse.update({
      isFollowing: true,
    })

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengikuti course',
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const openUserModule = async (req, res, next) => {
  try {
    const { user } = req
    const { courseId, userModuleId } = req.params

    const userCourse = await UserCourse.findOne({
      where: {
        userId: user.id,
        courseId,
      },
      include: userCourseRelation(user.id).include,
      order: [['Course', 'chapters', 'userModules', 'moduleData', 'no', 'ASC']],
    })

    if (!userCourse) {
      return next(new ApiError('User Course tidak ditemukan', 404))
    }

    const mergedUserModules = userCourse.Course.chapters.flatMap(
      (chapter) => chapter.userModules,
    )

    const indexUserModule = mergedUserModules.findIndex(
      (module) => module.id === parseInt(userModuleId, 10),
    )

    if (indexUserModule === -1) {
      return next(
        new ApiError(
          'Tidak ada relasi antara user course dan user module',
          403,
        ),
      )
    }

    const totalModuleStudied = mergedUserModules.reduce(
      (count, module) => (module.status === 'dipelajari' ? count + 1 : count),
      0,
    )

    const userModule = await UserModule.findByPk(userModuleId, {
      include: [
        {
          model: Module,
          as: 'moduleData',
          attributes: ['no', 'name', 'videoUrl'],
        },
      ],
    })

    if (!userModule) {
      return next(new ApiError('User Module tidak ditemukan', 404))
    }

    if (userModule.status === 'terkunci') {
      if (!userCourse.isAccessible) {
        return next(
          new ApiError(
            'Anda perlu menyelesaikan pembayaran terlebih dahulu untuk mengakses course ini',
            403,
          ),
        )
      }
      if (!userCourse.isFollowing) {
        return next(new ApiError('Anda belum mengikuti course ini', 403))
      }
      return next(
        new ApiError(
          'Module ini masih terkunci, selesaikan module yang sebelumnya dulu',
          403,
        ),
      )
    }

    if (
      userModule.status === 'terbuka'
      && userCourse.isAccessible === true
      && userCourse.isFollowing === true
    ) {
      const nextUserModule = mergedUserModules[indexUserModule + 1]
      if (nextUserModule) {
        await nextUserModule.update({
          status: 'terbuka',
        })
      }

      const progressPercentage = Math.ceil(
        ((totalModuleStudied + 1) / mergedUserModules.length) * 100,
      )

      if (progressPercentage === 100) {
        await userCourse.update({
          progress: 'completed',
        })
      }

      await userCourse.update({
        progressPercentage,
      })

      await userModule.update({
        status: 'dipelajari',
      })

      await userModule.reload()
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil membuka module',
      data: {
        module: userModule.moduleData,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getAllUserTransaction = async (req, res, next) => {
  try {
    const { user } = req

    const transactions = await Transaction.findAll({
      where: {
        userId: user.id,
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

    if (transactions.length === 0) {
      return next(new ApiError('Tidak ada transaksi', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mengambil transaksi',
      data: {
        transactions,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getUserTransactionById = async (req, res, next) => {
  try {
    const { user } = req
    const { transactionId } = req.params

    const transaction = await Transaction.findByPk(transactionId, {
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
      return next(new ApiError('Transaksi tidak ditemukan', 404))
    }

    if (transaction.userId !== user.id) {
      return next(
        new ApiError(
          'User tidak memiliki akses untuk melihat transaksi ini',
          403,
        ),
      )
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan data transaksi',
      data: {
        transaction,
      },
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

module.exports = {
  myDetails,
  updateMyDetails,
  getUserNotification,
  openNotification,
  deleteNotification,
  changeMyPassword,
  getMyCourses,
  openCourse,
  followCourse,
  openUserModule,
  getAllUserTransaction,
  getUserTransactionById,
}
