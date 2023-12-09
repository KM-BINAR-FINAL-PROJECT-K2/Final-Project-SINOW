const benefits = require('../seed_data/benefits')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Benefits', benefits, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Benefits', null, {})
  },
}
