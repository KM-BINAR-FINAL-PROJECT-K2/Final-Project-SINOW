const router = require('express').Router()

const Auth = require('../controllers/authController')

router.post('/login', Auth.login)
router.post('/register', Auth.register)
router.post('/verify-email', Auth.verifyEmail)
router.post('/resend-otp', Auth.resendOtp)
router.post('/reset-password', Auth.reqResetPassword)
router.post('/reset-password/:token', Auth.resetPassword)

module.exports = router
