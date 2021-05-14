'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Follows', [
      {
        FollowId: "6af5d09f-e9c6-4bb2-9146-b23fa764b70c",
        UserId: "6af5d09f-e9c6-4bb2-9146-b23fa764b70b",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Follows', null, {})
  }
}
