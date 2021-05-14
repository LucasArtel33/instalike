'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Posts', [
      {
        image: "/link/to/img.jpg",
        description: "Description de mon img #post #dev #description",
        location: "Bordeaux",
        UserId: "6af5d09f-e9c6-4bb2-9146-b23fa764b70c",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Posts', null, {})
  }
}
