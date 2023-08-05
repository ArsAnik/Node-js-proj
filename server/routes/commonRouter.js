const Router = require('express')
const router = new Router()
const CommonController = require('../controllers/commonController')

router.get('/error/:message', CommonController.show_errorPage);

module.exports = router