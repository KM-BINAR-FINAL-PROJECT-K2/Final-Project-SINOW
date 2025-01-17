const router = require('express').Router()

const User = require('../controllers/userController')
const authenticate = require('../middlewares/authenticate')
const uploader = require('../middlewares/uploader')

router.get('/', authenticate, User.myDetails)
router.patch(
  '/update',
  authenticate,
  uploader.single('image'),
  User.updateMyDetails,
)

router.patch('/change-password', authenticate, User.changeMyPassword)

router.get('/notifications', authenticate, User.getUserNotification)

router.get('/notifications/:id', authenticate, User.openNotification)

router.delete('/notifications/:id', authenticate, User.deleteNotification)

router.get('/my-courses', authenticate, User.getMyCourses)

router.get('/my-courses/:courseId', authenticate, User.openCourse)

router.post(
  '/my-courses/:courseId/follow-course',
  authenticate,
  User.followCourse,
)

router.get(
  '/my-courses/:courseId/modules/:userModuleId',
  authenticate,
  User.openUserModule,
)

router.get('/transaction', authenticate, User.getAllUserTransaction)
router.get(
  '/transaction/:transactionId',
  authenticate,
  User.getUserTransactionById,
)
router.delete(
  '/transaction/:transactionId',
  authenticate,
  User.deleteTransaction,
)

module.exports = router
