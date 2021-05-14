require('dotenv').config(); 
module.exports = {
   "development": {
    "username": process.env.DB_DEV_USER,
    "password": process.env.DB_DEV_PASSWORD,
    "database": process.env.DB_DEV_DATABASE,
    "host": process.env.DB_DEV_HOST,
    "port": process.env.DB_DEV_PORT,
    "dialect": process.env.DB_DIALECT,
    "logging": true,
    "logging": console.log
  },
  "test": {
    "username": process.env.DB_TEST_USER,
    "password": process.env.DB_TEST_PASSWORD,
    "database": process.env.DB_TEST_DATABASE,
    "host": process.env.DB_TEST_HOST,
    "port": process.env.DB_TEST_PORT,
    "dialect": process.env.DB_DIALECT
  },
  "production": {
    "username": process.env.DB_PROD_USER,
    "password": process.env.DB_PROD_PASSWORD,
    "database": process.env.DB_PROD_DATABASE,
    "host": process.env.DB_PROD_HOST,
    "port": process.env.DB_PROD_PORT,
    "dialect": process.env.DB_DIALECT
  },
  "aws": {
    "username": process.env.DB_PROD_USER,
    "password": process.env.DB_PROD_PASSWORD,
    "database": process.env.DB_PROD_DATABASE,
    "host": process.env.DB_PROD_HOST,
    "port": process.env.DB_PROD_PORT,
    "dialect": process.env.DB_DIALECT
  },
}
