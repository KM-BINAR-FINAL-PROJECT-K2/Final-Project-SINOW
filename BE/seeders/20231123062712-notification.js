const notificationData = require('../seed_data/notification')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Notifications', notificationData, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Notifications', null, {})
  },
}
