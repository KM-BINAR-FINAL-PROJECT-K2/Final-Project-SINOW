"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserCourse.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          allowNull: false,
        },
      });
      UserCourse.belongsTo(models.Course, {
        foreignKey: {
          name: "courseId",
          allowNull: false,
        },
      });
    }
  }
  UserCourse.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      isAccessible: DataTypes.BOOLEAN,
      lastSeen: DataTypes.DATE,
      progress: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: async (userCourse, options) => {
          const course = await userCourse.getCourse();

          await course.update({
            totalUser: course.totalUser + 1,
          });
        },
        beforeDestroy: async (userCourse, options) => {
          const course = await userCourse.getCourse();

          await course.update({
            totalUser: course.totalUser - 1,
          });
        },
      },
      sequelize,
      modelName: "UserCourse",
    }
  );
  return UserCourse;
};
