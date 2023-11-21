"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
      sequelize,
      modelName: "Module",
    }
  );
  return Module;
};
