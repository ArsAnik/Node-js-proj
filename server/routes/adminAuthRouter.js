const Router = require('express')
const router = new Router()
const controller = require('../controllers/adminAuthController')

router.post('/login', controller.admin_login)

module.exports = router