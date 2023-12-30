const router = require('express').Router()
const Notification = require('../controllers/notificationController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  Notification.createNotificationForAllUsers,
)

router.get(
  '/',
  authenticate,
  checkRole('admin'),
  Notification.getAllNotifications,
)

router.put(
  '/:id',
  authenticate,
  checkRole('admin'),
  Notification.updateNotification,
)

router.put(
  '/title/:titleParam',
  authenticate,
  checkRole('admin'),
  Notification.updateNotificationByTitle,
)

router.delete(
  '/:id',
  authenticate,
  checkRole('admin'),
  Notification.deleteNotificationById,
)
router.delete(
  '/title/:title',
  authenticate,
  checkRole('admin'),
  Notification.deleteNotificationByTitle,
)

module.exports = router
