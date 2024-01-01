const ApiError = require('./ApiError')
const { Category } = require('../models')

const validateCategory = async (categoryId, next) => {
  if (Array.isArray(categoryId)) {
    // eslint-disable-next-line consistent-return
    categoryId.forEach(async (cat) => {
      if (Number.isNaN(Number(cat))) {
        return next(
          new ApiError('Semua category harus berupa angka bilangan bulat', 400),
        )
      }
      const checkCategory = await Category.findByPk(cat)
      if (!checkCategory) {
        return next(
          new ApiError(
            'Category tidak tersedia, cek \'localhost:3000/api/v1/category\' untuk melihat daftar kategori yang tersedia',
            404,
          ),
        )
      }
    })
  } else {
    if (Number.isNaN(Number(categoryId))) {
      return next(
        new ApiError('Category harus berupa angka bilangan bulat', 400),
      )
    }
    const checkCategory = await Category.findByPk(categoryId)
    if (!checkCategory) {
      return next(
        new ApiError(
          'Category tidak tersedia, cek \'localhost:3000/api/v1/category\' untuk melihat daftar kategori yang tersedia',
          404,
        ),
      )
    }
  }
  return true
}

const validateLevel = (level, next) => {
  const validLevels = ['beginner', 'intermediate', 'advanced']

  if (typeof level === 'string') {
    if (!validLevels.includes(level)) {
      return next(
        new ApiError(
          'Level harus antara \'beginner\', \'intermediate\' atau \'advanced\', perhatikan juga huruf kecil besarnya',
          400,
        ),
      )
    }
  } else if (Array.isArray(level)) {
    if (!level.every((item) => validLevels.includes(item))) {
      return next(
        new ApiError(
          'Level harus antara \'beginner\', \'intermediate\' atau \'advanced\', perhatikan juga huruf kecil besarnya',
          400,
        ),
      )
    }
  }
  return true
}

const validateType = (type, next) => {
  if (type !== 'gratis' && type !== 'premium') {
    return next(new ApiError('Type harus \'gratis\' atau \'premium\'', 400))
  }
  return true
}

const validateNumericFields = (fields, next) => {
  const hasNonNumericFields = Object.keys(fields).forEach((field) => {
    if (Number.isNaN(Number(fields[field]))) {
      return next(
        new ApiError(
          `${field.charAt(0).toUpperCase() + field.slice(1)} harus angka`,
          400,
        ),
      )
    }
    return false
  })
  return !hasNonNumericFields
}

const getCourseOrder = (sortBy, next) => {
  const validSortBy = ['terbaru', 'terpopuler', 'promo']
  const courseOrder = []

  if (sortBy) {
    if (!validSortBy.includes(sortBy)) {
      return next(
        new ApiError('sortBy harus \'terbaru\', \'terpopuler\' atau \'promo\'', 400),
      )
    }
    if (sortBy === 'terbaru') {
      courseOrder.push(['createdAt', 'DESC'])
    } else if (sortBy === 'terpopuler') {
      courseOrder.push(['totalUser', 'DESC'])
    } else if (sortBy === 'promo') {
      courseOrder.push(['promoDiscountPercentage', 'DESC'])
    }
  }

  return courseOrder
}

const validateProgress = (progress, next) => {
  if (progress !== 'inProgress' && progress !== 'completed') {
    return next(
      new ApiError('progress harus \'inProgress\' atau \'completed\'', 400),
    )
  }
  return true
}

module.exports = {
  validateCategory,
  validateLevel,
  validateType,
  getCourseOrder,
  validateNumericFields,
  validateProgress,
}
