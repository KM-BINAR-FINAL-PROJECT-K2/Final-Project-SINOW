module.exports = (err, req, res) => {
  const error = { ...err }
  error.statusCode = error.statusCode || 500

  return res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  })
}
