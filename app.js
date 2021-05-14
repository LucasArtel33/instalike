require('dotenv').config()

const express = require('express')
const morgan = require('morgan');
const path = require('path')
const cors = require('cors')
const fs = require('fs');

// Import Routes
const userRouter = require('./routes/users')
const followRouter = require('./routes/follow')
const postRouter = require('./routes/post')
const likeRouter = require('./routes/like')
const commentRouter = require('./routes/comment')

const app = express()

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(morgan('combined', { stream: accessLogStream }))

const port = 3000;

// Prevent CORS
app.use(cors())

// Environment const
require('dotenv').config(path.join(__dirname, '/.env'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/uploads', express.static(__dirname + '/uploads'))

// Use routes
app.use('/users', userRouter)
app.use('/follows', followRouter)
app.use('/posts', postRouter)
app.use('/likes', likeRouter)
app.use('/comments', commentRouter)

module.exports = app;