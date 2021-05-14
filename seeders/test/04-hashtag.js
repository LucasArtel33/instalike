'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Hashtags', [
      {
        id: 1,
        hashtag: "post",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        hashtag: "dev",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        hashtag: "description",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Hashtags', null, {})
  }
}
