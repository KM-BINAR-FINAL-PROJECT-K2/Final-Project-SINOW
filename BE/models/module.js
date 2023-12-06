"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      // define association here
      Module.belongsToMany(models.User, {
        through: "UserModules",
        foreignKey: "moduleId",
        otherKey: "userId",
        as: "users",
      });
      Module.belongsTo(models.User, {
        foreignKey: {
          name: "createdBy",
          allowNull: false,
        },
        as: "moduleCreator",
      });
      Module.belongsTo(models.Chapter, {
        foreignKey: {
          name: "chapterId",
          allowNull: false,
        },
        as: "chapter",
        onDelete: "cascade",
      });
    }
  }
  Module.init(
    {
      name: DataTypes.STRING,
      no: DataTypes.INTEGER,
      videoUrl: DataTypes.STRING,
      chapterId: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      createdBy: DataTypes.INTEGER,
    },
    {
      hooks: {
        afterCreate: async (module, options) => {
          const chapter = await module.getChapter();
          const course = await chapter.getCourse();

          await chapter.update({
            totalDuration: chapter.totalDuration + module.duration,
          });

          await course.update({
            totalModule: course.totalModule + 1,
            totalDuration: course.totalDuration + module.duration,
          });
        },
        afterBulkCreate: async (modules, options) => {
          for (const module of modules) {
            const chapter = await module.getChapter();
            const course = await chapter.getCourse();

            await chapter.update({
              totalDuration: chapter.totalDuration + module.duration,
            });

            await course.update({
              totalModule: course.totalModule + 1,
              totalDuration: course.totalDuration + module.duration,
            });
          }
        },
        afterUpdate: async (module, options) => {
          const chapter = await module.getChapter();
          const course = await chapter.getCourse();

          const totalDuration = await Module.sum("duration", {
            where: {
              chapterId: module.chapterId,
            },
          });

          await course.update({
            totalDuration: totalDuration,
          });
        },
        beforeDestroy: async (module, options) => {
          console.log("Sebelum Modul Dihapus:", module.toJSON());
          const chapter = await module.getChapter();
          console.log("Chapter Modul:", chapter.toJSON());
          const course = await chapter.getCourse();
          console.log("Course Modul:", course.toJSON());

          await chapter.update({
            totalDuration: chapter.totalDuration - module.duration,
          });
          await course.update({
            totalModule: course.totalModule - 1,
            totalDuration: course.totalDuration - module.duration,
          });
        },
        beforeBulkDestroy: async (modules, options) => {
          for (const module of modules) {
            console.log("Sebelum Modul Dihapus (Bulk):", module.toJSON());
            const chapter = await module.getChapter();
            console.log("Chapter Modul (Bulk):", chapter.toJSON());
            const course = await chapter.getCourse();
            console.log("Course Modul (Bulk):", course.toJSON());

            await chapter.update({
              totalDuration: chapter.totalDuration - module.duration,
            });

            await course.update({
              totalModule: course.totalModule - 1,
              totalDuration: course.totalDuration - module.duration,
            });
          }
        },
      },
      sequelize,
      modelName: "Module",
    }
  );
  return Module;
};
