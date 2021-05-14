const User = require('../models').User
const Post = require('../models').Post
const Follow = require('../models').Follow
const Hashtag = require('../models').Hashtag
const Like = require('../models').Like
const Comment = require('../models').Comment

const hashtagService = require('../services/hashtag.service');


const { Op } = require('sequelize')
const moment = require('moment')

/**
 * @api {post} /posts Add one post
 * @apiName addPost
 * @apiGroup Post
 * 
 * @apiParam {File} image Image for the post
 * @apiParam {String} description Description of the post
 * @apiParam {String} location Location of the post
 * @apiParamExemple {json} Request-Example:
 * {
 *   "image": "file",
 *   "description": "Description de mon post #post #dev #description",
 *   "location": "Bordeaux",
 * }
 * 
 * @apiSuccess (200) {String} id Id of the post
 * @apiSuccess (200) {String} location Location of the post
 * @apiSuccess (200) {String} description Description of the post
 * @apiSuccess (200) {String} image Path where we can find the image
 * @apiSuccess (200) {String} UserId UUID of the User 
 * @apiSuccess (200) {DateTime} createdAt create of the User.
 * @apiSuccess (200) {DateTime} updatedAt last Update of the User.
 * @apiSuccessExemple {json} Success-Response:
 *  HTTP/1.1 200 OK
 * {
 *   "id": 1,
 *   "location": "Bordeaux",
 *   "description": "Description de mon post #post #dev #description",
 *   "image": "1620737627158-photo.png",
 *   "UserId": "76982e04-acea-4f7c-b804-b773311c98cc",
 *   "updatedAt": "2021-05-11T12:53:47.190Z",
 *   "createdAt": "2021-05-11T12:53:47.190Z"
 * }
 * @apiError Error Cant Add 
 * @apiErrorExample {json} Error-Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Can't add, bad fields. Check the documentation"
 *     }
 */
exports.post_add = (req, res, next) => {
  
  Object.assign(req.body, {"image":req.file.filename})
  Object.assign(req.body, {"UserId":res.locals.userConnected.userId})

  Post.create(req.body)
    .then(post => {
      hashtagService.addHashtag(post)
        .then(
          res.status(200).json(post)
        )
    })
    .catch(err => {
      res.status(400).json({"error": "Can't add, bad fields. Check the documentation"})
    })
}

/**
 * @api {put} /posts/:id Edit one post
 * @apiName editPost
 * @apiGroup Post
 * 
 * @apiParam {String} id Id of the post to update
 * 
 * @apiParam {String} description Description of the post
 * @apiParam {String} location Location of the post
 * @apiParamExemple {json} Request-Example:
 * {
 *   "description": "Edit description de mon post #post #dev #description",
 *   "location": "Bordeaux",
 * }
 * 
 * @apiSuccess (200) {String} message Post updated
 * @apiSuccessExemple {json} Success-Response:
 *  HTTP/1.1 201 CREATED
 * {
 *   "message": "Post 1 is updated"
 * }
 * @apiError Error Cant Add 
 * @apiErrorExample {json} Error-Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Can't add, bad fields. Check the documentation"
 *     }
 */
 exports.post_add = (req, res, next) => {
  
  Object.assign(req.body, {"UserId":res.locals.userConnected.userId})

  Post.update(req.body, {
    where:{
      id: req.params.id
    }
  })
    .then(post => {
      hashtagService.addHashtag(post)
        .then( post => {
          if(post > 0){
            res.status(201).json({'message': `Post ${id} is updated`});
          } else {
            res.status(404).json([]);
        }
        })
    })
    .catch(error=>{
      if(error.name == "SequelizeUniqueConstraintError"){
          res.status(403).json({'error': `Duplicate entry. Impossible to add`});
      }
  })

}

/**
 * @api {delete} /posts/:id Delete one post 
 * @apiName deletePost
 * @apiGroup Post
 * 
 * @apiParam {String} id Id of the post to delete
 * 
 * @apiSuccess (201) {String} success Post deleted
 * @apiSuccessExemple {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "success": "Post deleted"
 * }
 * @apiError (404) NothingToDelete No post to delete
 * @apiErrorExemple Nothing to delete
 * HTTP/1.1 404
 * []
 */
exports.post_delete = (req, res, next) => {
  Post.destroy({
    where:{
      id: req.params.id,
      UserId: res.locals.userConnected.userId
    }
  })
    .then(post => {
      if (post > 0) {
        res.status(200).json({ "success": 'Post deleted' })
      } else {
        res.status(404).json([])
      }
    })
}

/**
 * @api {get} /posts Find all post of user followed
 * @apiName listPost
 * @apiGroup Post
 * 
 * @apiSuccess (200) {Integer} id Id of the post
 * @apiSuccess (200) {String} image Image of the post
 * @apiSuccess (200) {String} location Location of the post
 * @apiSuccess (200) {Date} createdAt Date of creation of the post
 * @apiSuccess (200) {Text} description Description of the post
 * @apiSuccess (200) {String} UserId UUID of the user who like the post
 * @apiSuccess (200) {String} username Username of the user who like the post
 * @apiSuccessExemple {json} With Data
 * HTTP/1.1 200 OK
 * [
 *    {
 *       "id": 1,
 *       "image": "1620810573991-photo.png",
 *       "location": "langon",
 *       "createdAt": "2021-05-12T09:09:34.000Z",
 *       "description": "Description de mon post #post#dev #test",
 *       "Likes": [
 *           {
 *               "UserId": "cfa57a21-7be4-4472-a8b6-5373f8f5a192",
 *               "User": {
 *                   "username": "test"
 *               }
 *           }
 *       ],
 *       "Comments": [
 *           {
 *               "id": 1,
 *               "UserId": "5106c47c-ac79-48b5-8839-3682fc625bbb",
 *               "content": "commentaires",
 *               "commentParent": null,
 *               "createdAt": "2021-05-12T12:52:27.000Z",
 *               "User": {
 *                   "username": "test"
 *               }
 *           },
 *           {
 *               "id": 2,
 *               "UserId": "5106c47c-ac79-48b5-8839-3682fc625bbb",
 *               "content": "reponse",
 *               "commentParent": 1,
 *               "createdAt": "2021-05-12T12:52:53.000Z",
 *               "User": {
 *                   "username": "test"
 *               }
 *           }
 *       ]
 *    }
 * ]
 * @apiSuccess (200) No Data Nothing to show
 * @apiSuccessExemple No Data
 * HTTP/1.1 200 OK
 * {
 *    "message":"No user followed"
 * }
 */
exports.post_list = (req, res, next) => {
  const userConnected = res.locals.userConnected.userId

  Follow.findAll({
    attributes: ['FollowId'],
    where:{
      UserId: userConnected
    }
  })
    .then(follows => {
      if(follows.length > 0){
        let listFollow = [];
        follows.map(follow => {
          listFollow.push(follow.FollowId)
        })
        Post.findAll({
          attributes:['id', 'image', 'location', 'createdAt', 'description' ],
          include:[
            {
              model: Like,
              attributes:['UserId'],
              include: {
                model: User,
                attributes: ['username']
              }
            },
            {
              model: Comment,
              attributes:['id','UserId','content','commentParent', 'createdAt'],
              include: {
                model: User,
                attributes: ['username']
              }
            }
          ],
          where:{
            Userid: {
              [Op.in]: listFollow
            }
          }
        })
          .then(posts => {
            res.status(200).json(posts)
          })
        
      } else {
        res.status(200).json({"message":"No user followed"})
      }
    })

}

/**
 * @api {get} /posts/search Find all post with filter
 * @apiName searchPost
 * @apiGroup Post
 * 
 * @apiParam {String} location Location of posts (Not mandatory)
 * @apiParam {String} hashtag Hashtag of posts (Not mandatory)
 * @apiParam {String} date Date when the post was made (Not mandatory)
 * @apiParamExemple {json} Request-Example
 * {
 *    "location": "Bordeaux",
 *    "hashtag": "patateDouce",
 *    "date": "2021-01-01"
 * }
 * 
 * @apiSuccess (200) {Integer} id Id of the post
 * @apiSuccess (200) {String} image Image of the post
 * @apiSuccess (200) {Text} description Description of the post
 * @apiSuccess (200) {Date} createdAt Date of creation of the post
 * @apiSuccess (200) {String} location Location of the post
 * @apiSuccessExemple {json} With Data
 * HTTP/1.1 200 OK
 * [
 *   {
 *       "id": 3,
 *       "image": "1620745285090-photo.png",
 *       "description": "Description de mon post #post#dev #test",
 *       "createdAt": "2021-05-10T00:46:48.000Z",
 *       "location": "Bordeaux",
 *       "Likes": [
 *           {
 *               "UserId": "5106c47c-ac79-48b5-8839-3682fc625bbb",
 *               "User": {
 *                   "username": "test"
 *               }
 *           }
 *       ],
 *       "Comments": [
 *           {
 *               "UserId": "5106c47c-ac79-48b5-8839-3682fc625bbb",
 *               "content": "commentaires",
 *               "commentParent": null,
 *               "createdAt": "2021-05-12T12:52:27.000Z",
 *               "User": {
 *                   "username": "test"
 *               }
 *           },
 *           {
 *               "UserId": "5106c47c-ac79-48b5-8839-3682fc625bbb",
 *               "content": "reponse",
 *               "commentParent": 1,
 *               "createdAt": "2021-05-12T12:52:53.000Z",
 *               "User": {
 *                   "username": "test"
 *               }
 *           }
 *       ]
 *   }
 * ]
 * @apiSuccess (200) No Data Nothing to show
 * @apiSuccessExemple No Data
 * HTTP/1.1 200 OK
 * []
 */
 exports.post_search = (req, res, next) => {
  let conditions = {};
  let conditionHashtag
  if(req.body.location){
    Object.assign(conditions, {"location": req.body.location})
  }
  if(req.body.hashtag){
    const hashtag = req.body.hashtag.slice(1)
    conditionHashtag = {
      hashtag: hashtag
    }
  }
  if(req.body.date){
    const start = new Date(req.body.date)
    start.setUTCHours(0, 0, 0, 0)
    const startUTC = moment.utc(start.setDate(start.getDate()))

    const end = new Date(req.body.date)
    end.setUTCHours(23, 59, 59, 999)
    const endUTC = moment.utc(end)

    Object.assign(conditions, {"createdAt": {[Op.between]: [startUTC, endUTC]}})
  }

  Post.findAll({
    attributes: ['id', 'image', 'description', 'createdAt', 'location'],
    include:[
      {
        attributes: ['hashtag'],
        model:Hashtag,
        where:conditionHashtag
      },
      {
        model: Like,
        attributes:['UserId'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: Comment,
        attributes:['UserId','content','commentParent', 'createdAt'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ],
    where: conditions
  })
    .then(posts => {
      if(posts.length > 0){
        let listPost = [];
        posts.map(post => {
          listPost.push({
            "id": post.id,
            "image": post.image ,
            "description": post.description,
            "createdAt": post.createdAt ,
            "location": post.location,
            "Likes": post.Likes,
            "Comments": post.Comments
          })
        })
        res.status(200).json(listPost)
      } else {
        res.status(200).json([])
      }
    })
    .catch( err => console.log(err))
 }