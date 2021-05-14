const request = require('supertest')
const app = require('../app');
require('dotenv').config()

describe('Post Endpoint', () => {
  const token = process.env.TOKEN

  describe('GET /post', () => {

    it('should fetch all post', async () => {
      const res = await request(app)
          .get(`/posts`)
          .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toEqual(200)
    })
  })
  
})