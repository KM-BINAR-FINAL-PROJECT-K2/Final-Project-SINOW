"use strict";

const chapters = require("../seed_data/chapters");
const modules = require("../seed_data/modules");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Chapters", chapters, {});
    await queryInterface.bulkInsert("Modules", modules, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Chapters", null, {});
    await queryInterface.bulkDelete("Modules", null, {});
  },
};
