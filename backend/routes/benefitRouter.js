const router = require('express').Router()

const Benefit = require('../controllers/benefitController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')

router.post('/', authenticate, checkRole('admin'), Benefit.createBenefit)
router.get('/', Benefit.getAllBenefit)
router.get('/:id', Benefit.getBenefitById)
router.put('/:id', authenticate, checkRole('admin'), Benefit.updateBenefit)
router.delete('/:id', authenticate, checkRole('admin'), Benefit.deleteBenefit)

module.exports = router
