const ApiError = require('../utils/ApiError')

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      if (role !== req.user.role) {
        return next(new ApiError(`kamu tidak berkepentingan disini`, 403))
      }
      next()
    } catch (err) {
      return next(new ApiError(err.message, 500))
    }
  }
}

module.exports = checkRole
