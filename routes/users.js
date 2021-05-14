const express = require('express')
const router = express.Router()
const user_controller = require('../controller/user.controller')
const auth = require('../middleware/auth')

router.get('/', auth(), user_controller.show_user)
router.post('/', user_controller.user_add);
router.put('/:id', auth(), user_controller.update_user)
router.delete('/:id', auth(), user_controller.user_delete)

// Auth
router.post('/login', user_controller.user_login)

module.exports = router