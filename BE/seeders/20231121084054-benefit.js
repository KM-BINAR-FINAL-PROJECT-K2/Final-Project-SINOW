'use strict'

const benefits = require('../seed_data/benefits')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Benefits', benefits, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Benefits', null, {})
  },
}
