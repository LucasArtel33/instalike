const Comment = require('../models').Comment
const Post = require('../models').Post


/**
 * @api {post} /comments/comment/:id Add comment to a post
 * @apiName addComment
 * @apiGroup Comment
 * 
 * @apiParam {Integer} id Id of the post
 * @apiParamExemple {json} Request-Example:
 * {
 *   "content": "Constructive comment"
 * }
 * 
 * @apiSuccess (200) {String} success Comment added
 * @apiSuccessExemple {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *   "success":"comment added"
 * }
 * @apiError NotFound Post not found
 * @apiErrorExample {json} Not Found
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "post not found"
 * }
 */
exports.create_comment = (req, res, next) => {
  Post.findOne({
    where: {
      id: req.params.id
    }
  })
    .then(post => {
      if(post){
        Object.assign(req.body, {"PostId":post.id})
        Object.assign(req.body, {"UserId":res.locals.userConnected.userId})
        Comment.create(req.body)
          .then(() => {
            res.status(200).json({"success":"Comment added"})
          })
        } else {
          res.status(404).json({"error":"Post not found"})
        }
    })
}

/**
 * @api {post} /comments/reply/:id Add reply to a comment
 * @apiName addReply
 * @apiGroup Comment
 * 
 * @apiParam {Integer} id Id of the comment
 * @apiParamExemple {json} Request-Example:
 * {
 *   "content": "Great comment"
 * }
 * 
 * @apiSuccess (200) {String} success Comment added
 * @apiSuccessExemple {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *   "success":"reply added"
 * }
 * @apiError NotFound Comment not found
 * @apiErrorExample {json} Not Found
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "comment not found"
 * }
 */
 exports.create_reply = (req, res, next) => {

  Comment.findOne({
    attributes: ['PostId'],
    where: {
      id: req.params.id
    }
  })
    .then(comment => {
      if(comment){
        Object.assign(req.body, {"PostId":comment.PostId})
        Object.assign(req.body, {"commentParent":req.params.id})
        Object.assign(req.body, {"UserId":res.locals.userConnected.userId})
        Comment.create(req.body)
          .then(() => {
            res.status(200).json({"success":"reply added"})
          })
        } else {
          res.status(404).json({"error":"comment not found"})
        }
    })
}

/**
 * @api {delete} /comments/:id Delete one comment and his reply 
 * @apiName deleteComment
 * @apiGroup Comment
 * 
 * @apiParam {String} id Id of the comment to delete
 * 
 * @apiSuccess (201) {String} success Comment deleted
 * @apiSuccessExemple {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "success": "Comment deleted"
 * }
 * @apiError (404) NothingToDelete No Comment to delete
 * @apiErrorExemple Nothing to delete
 * HTTP/1.1 404
 * []
 */
 exports.comment_delete = (req, res, next) => {
  Comment.destroy({
    where:{
      id: req.params.id,
      UserId: res.locals.userConnected.userId
    }
  })
    .then(comment => {
      if (comment > 0) {
        Comment.destroy({
          where:{
            commentParent: req.params.id,
          }
        })
          .then(() => {
            res.status(200).json({ "success": "Comment deleted" })
          })
      } else {
        res.status(404).json([])
      }
    })
}