const Like = require('../models').Like
const Post = require('../models').Post

/**
 * @api {post} /likes/:id Add one like to a post
 * @apiName addLike
 * @apiGroup Like
 * 
 * @apiParam {Integer} id Id of the post to like
 * 
 * @apiSuccess (200) PostLiked Post liked
 * @apiSuccess (200) PostAlreadyLiked Post already liked
 * @apiSuccessExemple {json} Post Liked
 *  HTTP/1.1 200 OK
 * {
 *   "success":"Post liked"
 * }
 * @apiSuccessExemple {json} Post Already Liked
 *     HTTP/1.1 200 OK
 *     {
 *       "error": "Post already liked"
 *     }
 * 
 * @apiError (404) PostNotFound  Post not found 
 * @apiError (404) DuplicateEntry  Post already like
 * @apiErrorExample {json} Post Not Found
 *     HTTP/1.1 404 Bad Request
 *     {
 *       "error": "Post not found"
 *     }
 * 
 */
exports.add_like = (req, res, next) => {
  Post.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(post => {
      if(post){
        Like.findOrCreate({
          where: {
            PostId: req.params.id,
            UserId: res.locals.userConnected.userId
          },
          default: {
            PostId: req.params.id,
            UserId: res.locals.userConnected.userId
          }
        })
          .then(([like, created]) => {
            if(created){
              res.status(200).json({"success":"Post liked"})
            } else {
              res.status(200).json({'success': `Post already liked`});
            }
          })
      } else{
        res.status(404).json({"error":"Post not found"})
      }
    })
}

/**
 * @api {delete} /likes/:id Unlike one post 
 * @apiName deleteLikes
 * @apiGroup Post
 * 
 * @apiParam {String} id Id of the post to unlike
 * 
 * @apiSuccess (201) {String} success user unlike
 * @apiSuccessExemple {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "success": "Post unlike"
 * }
 * @apiError (404) NothingToDelete No post to unlike
 * @apiErrorExemple Nothing to delete
 * HTTP/1.1 404
 * []
 */
 exports.delete_like = (req, res, next) => {
  Like.destroy({
    where: {
      PostId: req.params.id,
      UserId: res.locals.userConnected.userId
    }
  })
    .then(like => {
      if (like > 0) {
        res.status(200).json({ "success": 'Post unliked' })
      } else {
        res.status(404).json([])
      }
    })
}