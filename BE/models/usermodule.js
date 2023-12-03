"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserModule extends Model {
    static associate(models) {
      // define association here
      UserModule.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
        as: "user",
      });
      UserModule.belongsTo(models.Module, {
        foreignKey: {
          name: "moduleId",
          allowNull: false,
        },
        as: "moduleData",
      });
      UserModule.belongsTo(models.Chapter, {
        foreignKey: {
          name: "chapterId",
          allowNull: false,
        },
        as: "chapter",
      });
    }
  }
  UserModule.init(
    {
      userId: DataTypes.INTEGER,
      moduleId: DataTypes.INTEGER,
      chapterId: DataTypes.INTEGER,
      status: {
        type: DataTypes.STRING,
        defaultValue: "terkunci",
      },
    },
    {
      sequelize,
      modelName: "UserModule",
    }
  );
  return UserModule;
};
