"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // define association here

      Course.belongsTo(models.User, {
        foreignKey: "createdBy",
        as: "courseCreator",
      });
      Course.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });
      Course.hasMany(models.Chapter, {
        foreignKey: "courseId",
        as: "chapters",
        onDelete: "cascade",
      });
    }
  }
  Course.init(
    {
      name: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      videoPreviewUrl: DataTypes.STRING,
      level: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      classCode: DataTypes.STRING,
      totalModule: DataTypes.INTEGER,
      type: DataTypes.STRING,
      price: DataTypes.INTEGER,
      totalDuration: DataTypes.INTEGER,
      courseBy: DataTypes.STRING,
      createdBy: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
