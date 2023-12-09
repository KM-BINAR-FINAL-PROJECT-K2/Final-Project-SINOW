'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Auth, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
      User.belongsToMany(models.Course, {
        through: 'UserCourses',
        foreignKey: 'userId',
        otherKey: 'courseId',
        as: 'courses',
      })
      User.belongsToMany(models.Module, {
        through: 'UserModules',
        foreignKey: 'userId',
        otherKey: 'moduleId',
        as: 'modules',
      })
      User.hasMany(models.Notification, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'notifications',
      })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      photoProfileUrl: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    },
  )
  return User
}
