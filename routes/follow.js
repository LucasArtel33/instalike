const express = require('express')
const router = express.Router()
const follow_controller = require('../controller/follow.controller')
const auth = require('../middleware/auth')

router.get('/', auth(), follow_controller.show_follow);
router.post('/:id', auth(), follow_controller.add_follow);
router.delete('/:id', auth(), follow_controller.delete_follow)


module.exports = router
