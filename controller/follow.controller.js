const Follow = require('../models').Follow
const User = require('../models').User

/**
* @api {get} /follows Show all follow of the user
* @apiName showFollow
* @apiGroup Follow
*
* @apiParam {String} id UUID of the User
* 
* @apiSuccess (200) {String} id UUID of the User
* @apiSuccess (200) {String} username Username of the User
* @apiSuccess (200) {String} email Email of the User
* @apiSuccess (200) {Date} birthday Birthday of the User
* @apiSuccessExemple {json} With Data
*  HTTP/1.1 200 OK
* [
*    {
*        "id": "c65b8c27-5da6-45e2-9e6c-caa03d264e3c",
*        "username": "test",
*        "email": "test@test.fr",
*        "birthday": "1996-09-05"
*    }
* ]
* 
* @apiSuccessExemple {json} With No Data
* HTTP/1.1 200 OK
* [
*   
* ]
*/
exports.show_follow = (req, res, next) => {
  
  Follow.findAll({
    includes: {
      model: User,
      attributes: ['id', 'username', 'email', 'birthday']
    },
    where: {
      UserId: res.locals.userConnected.userId
    }
  })
    .then( follow => {
      if(follow.length > 0){
        res.status(200).json(follow)
      } else {
        res.status(200).json([])
      }
    })
}

/**
* @api {post} /follows/:id Add one follow to the user
* @apiName addFollow
* @apiGroup Follow
*
* @apiParam {String} id UUID of the User to follow
*
* @apiSuccess (201) {String} success user followed
* @apiSuccessExemple {json} Success-Response
* HTTP/1.1 201 CREATED
* {
*    "success": "user followed"
* }
* 
* @apiError (403) AlreadyFollowed user already followed
* @apiError (400) Can'tAdd Can't add, bad fields. Check the documentation
* @apiError (404) UserNotFound user to follow not found
* @apiErrorExemple Already Followed
* HTTP/1.1 403 
* {
*    "error": "user already followed"
* }
* @apiErrorExemple Can't Add
* HTTP/1.1 400 
* {
*    "error": "Can't add, bad fields. Check the documentation"
* }
* @apiErrorExemple User Not Found
* HTTP/1.1 404
* {
*    "error": "user to follow not found"
* }
*/
exports.add_follow = (req, res, next) => {
  const followId = req.params.id
  User.findOne({
    where: {
      id: followId
    }
  })
    .then(user => {
      if(user){
        Follow.findOrCreate({
          where:{
            UserId: res.locals.userConnected.userId,
            FollowId: user.id
          },
          default: {
            UserId: res.locals.userConnected.userId,
            FollowId: user.id
          }
        })
        .then(([follow, created]) => {
          if (created) {
            res.status(201).json({success: 'user followed'})
          } else {
            res.status(403).json({error: 'user already followed'})
          }
        })
        .catch( err => {
          res.status(400).json({'error': `Can't add, bad fields. Check the documentation`});
        })
      } else {
        res.status(404).json({'error': 'user to follow not found'})
      }
    })
}

/**
 * @api {delete} /follows/:id Delete one follow 
 * @apiName deleteFollow
 * @apiGroup Follow
 * 
 * @apiParam {String} id UUID of the User to unfollow
 * 
 * @apiSuccess (201) {String} success user followed
 * @apiSuccessExemple {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "success": "User unfollowed"
 * }
 * @apiError (404) NothingToDelete No follow to delete
 * @apiErrorExemple Nothing to delete
 * HTTP/1.1 404
 * []
 */
 exports.delete_follow = (req, res, next) => {
  const followId = req.params.id
  Follow.destroy({
    where:{
      FollowId: followId,
      UserId: res.locals.userConnected.userId
    }
  })
    .then(follow => {
      if (follow > 0) {
        res.status(200).json({ "success": 'User unfollowed' })
      } else {
        res.status(404).json([])
      }
    })
}

 


