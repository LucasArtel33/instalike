const User = require('../models').User

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');



/**
 * @api {get} /users Show all users
 * @apiName showUser
 * @apiGroup User
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
exports.show_user = (req, res, next) => {
  User.findAll({
    attributes: ['id', 'username', 'email', 'birthday']
  })
    .then(users => {
      if(users.length > 0){
        res.status(200).json(users)
      } else {
        res.status(200).json([])
      }
    })
    .catch(err => console.error(err))
}

/** 
 * @api {put} /users/:id Edit one customer
 * @apiName editUser
 * @apiGroup User
 * 
 * @apiParam {UUID} id UUID of the user
 * @apiParam {String} username Username of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 * @apiParamExemple {json} Request-Example:
 * {
 *   "username": "test",
 *   "email": "test@test.fr",
 *   "password": "test",
 * }
 * 
 * @apiSuccess (201) {String} success User updated
 * @apiSuccessExemple {json} Success-Response
 * HTTP/1.1 200 OK
 * {
 *    "success": "User updated"
 * }
 * @apiError (401) Unauthorized You don't have permission to edit that user
 * @apiErrorExemple Unauthorized
 * HTTP/1.1 401 Unauthorized
 * {
 *    "error":"You don't have permission to edit that user"
 * }
 */
exports.update_user = (req, res, next) => {
  const id = req.params.id
  if(id === res.locals.userConnected.userId){
    if(req.body.password){
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        req.body.password = hash
      })
    }
    User.update(req.body, {
      where: {
        id: id
      }
    })
      .then(user => {
        if(user > 0 ) {
          res.status(201).json({'message': 'User updated'})
        }
      })
      .catch(error=> console.log(error))
  } else {
    res.status(401).json({"error":"You don't have permission to edit that user"})
  }
  
}

/**
 * @api {post} /users Add one user
 * @apiName addUser
 * @apiGroup User
 *
 * @apiParam {String} username Username of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 * @apiParamExemple {json} Request-Example:
 * {
 *   "username": "test",
 *   "email": "test@test.fr",
 *   "password": "test",
 *   "birthday": "1996-09-05"
 * }
 * 
 * @apiSuccess (200) {String} id UUID of the User
 * @apiSuccess (200) {String} username Username of the User
 * @apiSuccess (200) {String} email Email of the User
 * @apiSuccess (200) {Date} birthday Birthday of the User
 * @apiSuccess (200) {String} password Password of the User
 * @apiSuccess (200) {DateTime} createdAt create of the User.
 * @apiSuccess (200) {DateTime} updatedAt last Update of the User.
 * @apiSuccessExemple {json} Success-Response:
 *     HTTP/1.1 200 OK
 * {
 *   "follow": {},
 *   "id": "2c1fc651-60cf-48b1-be4e-8500cbf98969",
 *   "username": "test",
 *   "email": "test@test.fr",
 *   "birthday": "1996-09-05"
 *   "password": "$2a$10$3oYpc/n6hU/Fmj6zgoiwUucQGl3mTjy/FNB67mf8KYTxiJV/fJlO2",
 *   "updatedAt": "2021-05-10T14:03:31.959Z",
 *   "createdAt": "2021-05-10T14:03:31.959Z"
 * }
 * 
 * @apiError BadRequest Can't Add
 * @apiError DuplicateEntry Can't Add
 * @apiError TooYoung Too young
 * @apiErrorExample {json} Bad Request
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "Can't add, bad fields. Check the documentation"
 * }* 
 * @apiErrorExample {json} Too Young
 * HTTP/1.1 400 Bad Request
 * {
 *   "error": "You must be over 18 years old"
 * }
 * @apiErrorExample {json} Duplicate Entry
 * HTTP/1.1 403 Forbidden
 * {
 *   "error": "Duplicate entry. Impossible to add"
 * }
 */
exports.user_add = (req, res, next) => {
  const dateNow = Date.parse(new Date())
  const birth = Date.parse(new Date(req.body.birthday))
  majorite = 18*365.5*24*60*60*1000
  age =  dateNow - birth

  if(majorite <= age){
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      req.body.password = hash
  
      if ( req.body.id === "" ){
        Object.assign(req.body, {id: uuidv4()});
      }
      
      User.create(req.body)
        .then(user => {
          if(user){
            res.status(201).json(user)
          }
        })
        .catch(error => {
          if(error.name == "SequelizeUniqueConstraintError"){
              res.status(403).json({'error': `Duplicate entry. Impossible to add`});
          } else {
              res.status(400).json({'error': `Can't add, bad fields. Check the documentation`});
          }
      })
    })
  } else {
    res.status(400).json({'error': `You must be over 18 years old`});
  }
}

/**
 * @api {post} /users/login User login
 * @apiName loginUser
 * @apiGroup User
 *
 * @apiParam {String} email email of the User.
 * @apiParam {String} password password of the User.
 * @apiParamExample {json} Request-Example:
 *     {
 *       "email": "test@test.fr",
 *       "password": "test"
 *     }
 *
 * @apiSuccess (200) {String} token token of the User.
 * @apiSuccess (200) {String} id UUID of the User
 * @apiSuccess (200) {String} username Username of the User
 * @apiSuccess (200) {String} email Email of the User
 * @apiSuccess (200) {Date} birthday Birthday of the User
 * @apiSuccess (200) {String} password Password of the User
 * @apiSuccess (200) {DateTime} createdAt create of the User.
 * @apiSuccess (200) {DateTime} updatedAt last Update of the User.
 * @apiSuccessExample {json} Success-Response
 *  HTTP/1.1 200 OK
 *  [
 *    {
 *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAdGVzdC5mciIsInVzZXJJZCI6IjdhZjUzNWMwLTQ2MmMtNDFkNS04MjFkLTFiNmIyM2YxOTk0OSIsInVzZXJuYW1lIjoidGVzdCIsImlhdCI6MTYyMDY1NzE4MywiZXhwIjoxNjIwNzQzNTgzfQ.Q11s7HdYBFha-1VnepxOsqe7Z3KLwdWnk7SRTc1KnUg",
 *      "user": {
 *        "follow": {},
 *        "id": "7af535c0-462c-41d5-821d-1b6b23f19949",
 *        "username": "test",
 *        "email": "test@test.fr",
 *        "birthday": "1996-09-05"
 *        "password": "$2a$10$bU4rPbIlbAZ.SOihZDYbBOu7m12RhOLFcRZcoZcViCdNIsB/RCrzO",
 *        "createdAt": "2021-05-10T14:21:47.000Z",
 *        "updatedAt": "2021-05-10T14:21:47.000Z"
 *      }
 *    }
 *  ]
 * @apiError WrongEmail
 * @apiErrorExemple {json} Error-Response
 *  HTTP/1.1 400 Bad Request
 *  {
 *    "message": "Wrong email or password"
 *  }
 */
exports.user_login = (req, res, next) => {
  User.findOne({ where: { email: req.body.email } })
    .then(user => {
      if (user) {
        verifyPassword(user, req, res)
      } else {
        res.status(400).json({ message: 'Wrong email or password' })
      }
    })
    .catch(error => {
      res.status(500).json(error)
    })
}

/**
 * @api {delete} /users/:id Delete one user
 * @apiName deleteUser
 * @apiGroup User
 *
 * @apiParam {Integer} id UUID of the user.
 *
 * @apiSuccess {String} message User deleted.
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   message: "User deleted"
 * }
 *  @apiError Error - Cant Delete
 * @apiErrorExample {json} Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Nothing here"
 * }
 * @apiError (401) Unauthorized You don't have permission to edit that user
 * @apiErrorExemple Unauthorized
 * HTTP/1.1 401 Unauthorized
 * {
 *    "error":"You don't have permission to edit that user"
 * }
 */
 exports.user_delete = (req, res, next) => {
  const id = req.params.id
  if(id === res.locals.userConnected.userId){
    User.destroy({
      where: {
        id: id
      }
    })
      .then(user => {
        if (user > 0) {
          res.status(200).json({ message: 'User deleted' })
        } else {
          res.status(404).json([])
        }
      })
  }else {
    res.status(401).json({"error":"You don't have permission to edit that user"})
  }
}

const verifyPassword = (user, req, res) => {
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (err) {
      return res.status(500).json(err)
    }
    else {
      if (result) {
        return getToken(user, res)
      }
      else {
        return res.json({ message: 'You fail' })
      }
    }
  })
}

const getToken = (user, res) => {
  const token = jwt.sign({ email: user.email, userId: user.id, username: user.username }, process.env.JWT_KEY, { expiresIn: '365d' })
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.status(200).json({
    token: token,
    user: user
  })
}
