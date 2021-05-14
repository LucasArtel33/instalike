const request = require('supertest')
const app = require('../app');
require('dotenv').config()

describe('User EndPoint', () => {
  const token = process.env.TOKEN
  
  describe('GET /users' , () => {
    it('should fetch all user', async () => {
      const res = await request(app)
          .get(`/users`)
          .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
    })
  })

  describe('POST /users/login', () => {
    const data = {
      "email":"test@test.fr",
      "password":"test"
    }

    const fail = {
      "email":"patate@douce.fr",
      "password":"merguez"
    }

    it('should login an user', async () => {
      const res = await request(app)
          .post(`/users/login`)
          .send(data)
      expect(res.statusCode).toEqual(200)
    })

    it('should throw an error', async () => {
      const res = await request(app)
          .post(`/users/login`)
          .send(fail)
      expect(res.statusCode).toEqual(400)
    })
  })

  describe('POST /users' , () => {

    const data = {
      "username": "testadd",
      "email": "testadd@test.fr",
      "password": "test",
      "birthday": "1996-09-05"
    }

    const duplicate = {
      "username": "test",
      "email": "test@test.fr",
      "password": "test",
      "birthday": "1996-09-05"
    }

    it('should create an user', async () => {
      const res = await request(app)
          .post(`/users`)
          .send(data)
      expect(res.statusCode).toEqual(201)
    })

    it('should throw duplicate error', async () => {
      const res = await request(app)
          .post(`/users`)
          .send(duplicate)
      expect(res.statusCode).toEqual(403)
    })

    it('should throw error', async () => {
      const res = await request(app)
          .post(`/users`)
          .send({noHash:"patateDouce"})
      expect(res.statusCode).toEqual(400)
    })

  })

  describe('PUT /users/:id', () => {
    const data = {
      "username": "testEdit",
      "email": "test@test.fr",
      "password": "test"
    }

    it('should edit an user', async () => {
      const userId = '6af5d09f-e9c6-4bb2-9146-b23fa764b70b';
      const res = await request(app)
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)
      expect(res.statusCode).toEqual(201)
    })

    it('should edit an user', async () => {
      const userId = 'bdfbc138-a3e1-4502-88cd-e4f63ab81e6f';
      const res = await request(app)
          .put(`/users/${userId}`)
          .set('Authorization', `Bearer ${token}`)
          .send(data)
      expect(res.statusCode).toEqual(401)
    })
  })

  describe('DELETE /users/:id', () => {
    const tokenDelete = process.env.TOKEN_DELETE

    it('should delete an user', async () => {
      const userId = "bdfbc138-a3e1-4502-88cd-e4f63ab81e6f"
      const res = await request(app)
          .delete(`/users/${userId}`)
          .set('Authorization', `Bearer ${tokenDelete}`)
      expect(res.statusCode).toEqual(200)
    })
  })
})