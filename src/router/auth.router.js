const { Router } = require('express')
const router = Router()

const authentication = require("../middlewares/auth.middleware")

const authController = require("../controllers/auth.controller")

router.post('/register/', authController.register)
router.post('/login/', authController.login)
router.get('/protected/', authentication, authController.protected)
router.post('/logout/', authentication, authController.revokeToken)

module.exports = router