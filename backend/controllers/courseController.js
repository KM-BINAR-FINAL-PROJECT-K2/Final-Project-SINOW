const { Op } = require('sequelize')

const {
  Course,
  User,
  Category,
  Chapter,
  Module,
  Benefit,
} = require('../models')
const {
  validateCategory,
  validateLevel,
  validateType,
  validateNumericFields,
  getCourseOrder,
} = require('../utils/courseValidator')

const ApiError = require('../utils/ApiError')

const { uploadImage, uploadVideo } = require('../utils/imagekitUploader')

const createCourse = async (req, res, next) => {
  const { user } = req

  try {
    const {
      name,
      level,
      rating,
      categoryId,
      description,
      classCode,
      type,
      price = 0,
      promoDiscountPercentage = 0,
      courseBy,
    } = req.body

    const missingFields = [
      'name',
      'level',
      'rating',
      'categoryId',
      'description',
      'classCode',
      'type',
      'price',
      'courseBy',
    ].filter((field) => !req.body[field])

    if (missingFields.length > 0) {
      return next(
        new ApiError(`Field ${missingFields.join(', ')} harus diisi`, 400),
      )
    }

    if (Object.keys(req.files).length !== 2) {
      return next(new ApiError('Harus menyertakan gambar dan video', 400))
    }

    validateLevel(level, next)
    validateType(type, next)
    validateNumericFields({ rating, price, promoDiscountPercentage }, next)
    await validateCategory(categoryId, next)

    if (rating < 0 || rating > 5) {
      return next(new ApiError('Rating harus antara 0 dan 5', 400))
    }

    if (promoDiscountPercentage < 0 || promoDiscountPercentage > 100) {
      return next(new ApiError('Promo harus antara 0 dan 100', 400))
    }

    if (type === 'premium') {
      if (price <= 0) {
        return next(new ApiError('Harga harus lebih dari 0', 400))
      }

      if (Number.isNaN(Number(price))) {
        return next(new ApiError('Harga harus berupa angka', 400))
      }
    }

    const { imageUrl } = await uploadImage(req.files.image[0], next)
    const { videoUrl } = await uploadVideo(req.files.video[0], next)

    const course = await Course.create({
      name,
      level,
      rating,
      categoryId: Math.floor(categoryId),
      description,
      classCode,
      totalDuration: 0,
      totalModule: 0,
      type,
      price: type === 'gratis' ? 0 : price,
      promoDiscountPercentage: Math.floor(promoDiscountPercentage),
      totalUser: 0,
      imageUrl,
      videoPreviewUrl: videoUrl,
      courseBy,
      createdBy: user.id,
    })

    return res.status(201).json({
      status: 'Success',
      message: 'Berhasil menambahkan data course',
      data: course,
    })
  } catch (error) {
    return next(new ApiError(error.message, 500))
  }
}

const getAllCourse = async (req, res, next) => {
  try {
    // eslint-disable-next-line no-trailing-spaces
    const {
      // eslint-disable-next-line comma-dangle
      search,
      category,
      level,
      type,
      sortBy,
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

    const courseOrder = getCourseOrder(sortBy, next)

    const courses = await Course.findAll({
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
          attributes: ['id', 'no', 'description'],
        },
      ],
      where,
      order: [courseOrder.length === 0 ? ['id', 'ASC'] : courseOrder],
    })

    if (!courses || courses.length === 0) {
      return next(new ApiError('Course tidak ada', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: 'Berhasil mendapatkan data course',
      data: courses,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params
    const course = await Course.findByPk(id, {
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
          attributes: ['id', 'no', 'description'],
        },
        {
          model: Chapter,
          as: 'chapters',
          attributes: ['id', 'no', 'name', 'totalDuration'],
          include: [
            {
              model: Module,
              as: 'modules',
              attributes: ['id', 'no', 'name', 'videoUrl', 'duration'],
            },
          ],
        },
      ],
      order: [
        ['id', 'ASC'],
        ['benefits', 'no', 'ASC'],
        ['chapters', 'no', 'ASC'],
        ['chapters', 'modules', 'no', 'ASC'],
      ],
    })

    if (!course) {
      return next(new ApiError('Data course tidak ditemukan', 404))
    }

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mendapatkan data course id: ${id}`,
      data: course,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      name,
      level,
      rating,
      categoryId,
      description,
      classCode,
      type,
      price,
      promoDiscountPercentage,
      courseBy,
    } = req.body

    const course = await Course.findByPk(id)
    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    const updateData = {}

    if (name) {
      updateData.name = name
    }

    if (level) {
      validateLevel(level, next)
      updateData.level = level
    }

    if (rating) {
      validateNumericFields({ rating }, next)
      if (rating < 0 || rating > 5) {
        return next(new ApiError('Rating harus antara 0 dan 5', 400))
      }
      updateData.rating = rating
    }

    if (categoryId) {
      validateCategory(categoryId, next)
      updateData.categoryId = categoryId
    }

    if (courseBy) {
      updateData.courseBy = courseBy
    }

    if (description) {
      updateData.description = description
    }

    if (classCode) {
      updateData.classCode = classCode
    }

    if (type) {
      validateType(type, next)
      if (type === 'gratis') {
        updateData.price = 0
      }
      if (type === 'premium') {
        if (!price || price <= 0) {
          return next(new ApiError('Harga course harus lebih dari 0', 400))
        }
        if (Number.isNaN(Number(price))) {
          return next(new ApiError('Harga yang dimasukkan bukan angka', 400))
        }
        updateData.price = price
      }
      updateData.type = type
    }

    if (promoDiscountPercentage) {
      if (promoDiscountPercentage < 0 || promoDiscountPercentage > 100) {
        return next(new ApiError('Promo harus antara 0 dan 100', 400))
      }
      validateNumericFields({ promoDiscountPercentage }, next)
      updateData.promoDiscountPercentage = promoDiscountPercentage
    }

    if (req.files || Object.keys(req.files).length > 0) {
      if (req.files.image) {
        const { imageUrl } = await uploadImage(req.files.image[0], next)
        updateData.imageUrl = imageUrl
      }

      if (req.files.video) {
        const { videoUrl } = await uploadVideo(req.files.video[0], next)
        updateData.videoPreviewUrl = videoUrl
      }
    }

    await course.update(updateData)

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil mengupdate data course id: ${id}`,
      data: course,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params

    const course = await Course.findByPk(id)
    if (!course) {
      return next(new ApiError('Course tidak ditemukan', 404))
    }

    await course.destroy()

    return res.status(200).json({
      status: 'Success',
      message: `Berhasil menghapus data course dengan id: ${id}`,
    })
  } catch (error) {
    return next(new ApiError(error, 500))
  }
}

module.exports = {
  createCourse,
  getAllCourse,
  getCourseById,
  deleteCourse,
  updateCourse,
}
