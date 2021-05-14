'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        id:"6af5d09f-e9c6-4bb2-9146-b23fa764b70b",
        username: "test",
        email: "test@test.fr",
        password: "$2a$10$SHa.7pOqCzi7krOiLC59Ru1.0cstFsmu7knIlADVnqqZQ.otc6coC",
        birthday: "1996-09-05",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:"6af5d09f-e9c6-4bb2-9146-b23fa764b70c",
        username: "test2",
        email: "test2@test.fr",
        password: "$2a$10$SHa.7pOqCzi7krOiLC59Ru1.0cstFsmu7knIlADVnqqZQ.otc6coC",
        birthday: "1996-09-05",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id:"bdfbc138-a3e1-4502-88cd-e4f63ab81e6f",
        username: "edit",
        email: "edit@test.fr",
        password: "$2a$10$SHa.7pOqCzi7krOiLC59Ru1.0cstFsmu7knIlADVnqqZQ.otc6coC",
        birthday: "1996-09-05",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
