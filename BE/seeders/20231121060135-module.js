const chapters = require('../seed_data/chapters')
const modules = require('../seed_data/modules')
const { Module } = require('../models')

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Chapters', chapters, {})
    await queryInterface.bulkInsert('Modules', modules, {})

    await Module.afterBulkCreate(modules)
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Chapters', null, {})
    await queryInterface.bulkDelete('Modules', null, {})
  },
}
