const { chapters, modules } = require('../seed_data/chapterModuleMapping')

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Chapters', chapters, {})
    await queryInterface.bulkInsert('Modules', modules, {})
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Chapters', null, {})
    await queryInterface.bulkDelete('Modules', null, {})
  },
}
