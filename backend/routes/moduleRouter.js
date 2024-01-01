const router = require('express').Router()

const Module = require('../controllers/moduleController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')
const uploader = require('../middlewares/uploader')

router.post(
  '/',
  authenticate,
  checkRole('admin'),
  uploader.single('video'),
  Module.createModule,
)
router.get('/', Module.getAllModule)
router.get('/:id', Module.getModuleById)
router.put(
  '/:id',
  authenticate,
  checkRole('admin'),
  uploader.single('video'),
  Module.updateModule,
)
router.delete('/:id', authenticate, checkRole('admin'), Module.deleteModule)

module.exports = router
