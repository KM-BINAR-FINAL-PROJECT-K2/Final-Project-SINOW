"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserModule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserModule.init(
    {
      userId: DataTypes.INTEGER,
      moduleId: DataTypes.INTEGER,
      isStudied: DataTypes.BOOLEAN,
      isUnlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "UserModule",
    }
  );
  return UserModule;
};
