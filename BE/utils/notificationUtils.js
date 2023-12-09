const { Notification } = require('../models')
const ApiError = require('../utils/ApiError')

const createNotification = async (type, title, userId, content) => {
  try {
    await Notification.create({
      type: type,
      title: title,
      content: content,
      userId: userId,
      isRead: false,
    })
  } catch (err) {
    return next(new ApiError(err.message, 500))
  }
}

module.exports = {
  createNotification,
}
