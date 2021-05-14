const express = require('express')
const router = express.Router()
const like_controller = require('../controller/like.controller')
const auth = require('../middleware/auth')

router.post('/:id', auth(), like_controller.add_like)
router.delete('/:id', auth(), like_controller.delete_like)

module.exports = router