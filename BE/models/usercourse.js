const { Model } = require('sequelize')

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
          name: 'userId',
          allowNull: false,
        },
      })
      UserCourse.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
      })
    }
  }
  UserCourse.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      isAccessible: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isFollowing: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastSeen: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      progress: {
        type: DataTypes.STRING,
        defaultValue: 'inProgress',
      },
      progressPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 100,
        },
      },
    },
    {
      hooks: {
        beforeCreate: async (userCourse) => {
          const course = await userCourse.getCourse()

          await course.update({
            totalUser: course.totalUser + 1,
          })
        },
        beforeDestroy: async (userCourse) => {
          const course = await userCourse.getCourse()

          await course.update({
            totalUser: course.totalUser - 1,
          })
        },
      },
      sequelize,
      modelName: 'UserCourse',
    },
  )
  return UserCourse
}
