const router = require('express').Router()

const Chapter = require('../controllers/chapterController')
const authenticate = require('../middlewares/authenticate')
const checkRole = require('../middlewares/checkRole')

router.post('/', authenticate, checkRole('admin'), Chapter.createChapter)
router.get('/', Chapter.getAllChapter)
router.get('/:id', Chapter.getChapterById)
router.put('/:id', authenticate, checkRole('admin'), Chapter.updateChapter)
router.delete('/:id', authenticate, checkRole('admin'), Chapter.deleteChapter)

module.exports = router
