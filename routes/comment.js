const express = require('express')
const router = express.Router()
const comment_controller = require('../controller/comment.controller')
const auth = require('../middleware/auth')

router.post('/comment/:id', auth(), comment_controller.create_comment)
router.post('/reply/:id', auth(), comment_controller.create_reply)
router.delete('/:id', auth(), comment_controller.comment_delete)


module.exports = router
