const { Router } = require('express')
const router = Router()

const testController = require('../controllers/test.controller')

router.get('/', testController.getTest)
router.get('/:tid', testController.getTestItem)
router.post('/', testController.postTest)
router.put('/:tid', testController.putTest)
router.patch('/:tid', testController.patchTest)
router.delete('/:tid', testController.deleteTest)

module.exports = router