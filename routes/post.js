const express = require('express')
const router = express.Router()
const post_controller = require('../controller/post.controller')
const auth = require('../middleware/auth')

const multer = require('multer');

let upload;
let storage;
if(process.env.FILE_FOLDER_ENV == 'DEV'){
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, process.env.FILE_UPLOAD_FOLDER_DEV)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+'-'+file.originalname);
    }
  })
}
  
upload = multer({ storage })

router.get('/', auth(), post_controller.post_list)
router.get('/search', auth(), post_controller.post_search)
router.post('/', auth(), upload.single('image'), post_controller.post_add)
router.delete('/:id', auth(), post_controller.post_delete)

module.exports = router
