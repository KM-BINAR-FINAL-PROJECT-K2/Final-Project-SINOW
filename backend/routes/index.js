const router = require('express').Router()
const swaggerUi = require('swagger-ui-express')

const swaggerDocument = require('../docs/swagger.json')

const Course = require('./courseRouter')
const Auth = require('./authRouter')
const Module = require('./moduleRouter')
const Category = require('./categoryRouter')
const Notification = require('./notificationRouter')
const User = require('./userRouter')
const Chapter = require('./chapterRouter')
const Benefit = require('./benefitRouter')
const Transaction = require('./transactionRouter')
const Dashboard = require('./dashboardDetailRouter')

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
router.use('/api/v1/auth', Auth)
router.use('/api/v1/user', User)
router.use('/api/v1/courses', Course)
router.use('/api/v1/chapters', Chapter)
router.use('/api/v1/modules', Module)
router.use('/api/v1/category', Category)
router.use('/api/v1/notifications', Notification)
router.use('/api/v1/benefits', Benefit)
router.use('/api/v1/transactions', Transaction)
router.use('/api/v1/dashboard', Dashboard)

module.exports = router
