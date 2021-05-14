'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Posthashtags', [
      {
        PostId: 1,
        HashtagId:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        PostId: 1,
        HashtagId:2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        PostId: 1,
        HashtagId:3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posthashtags', null, {})
  }
}
