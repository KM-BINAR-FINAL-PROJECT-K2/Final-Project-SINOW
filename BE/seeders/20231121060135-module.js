const chapters = require('../seed_data/chapters')
const modules = require('../seed_data/modules')

const { Chapter, Module } = require('../models')

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up() {
    await Chapter.bulkCreate(chapters, {})
    await Module.bulkCreate(modules, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Chapters', null, {})
    await queryInterface.bulkDelete('Modules', null, {})
  },
}
