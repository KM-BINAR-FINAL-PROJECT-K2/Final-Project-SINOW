// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const error = { ...err }
  error.statusCode = error.statusCode || 500

  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  })
}
