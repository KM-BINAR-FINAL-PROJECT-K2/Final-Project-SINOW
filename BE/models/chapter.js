'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chapter.hasMany(models.Module, {
        foreignKey: {
          name: 'chapterId',
          allowNull: false,
        },
        as: 'modules',
        onDelete: 'cascade',
        hooks: true,
      })
      Chapter.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
        onDelete: 'cascade',
      })

      Chapter.hasMany(models.UserModule, {
        foreignKey: {
          name: 'chapterId',
          allowNull: false,
        },
        as: 'userModules',
      })
    }
  }
  Chapter.init(
    {
      no: DataTypes.INTEGER,
      name: DataTypes.STRING,
      courseId: DataTypes.INTEGER,
      totalDuration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'Chapter',
    },
  )
  return Chapter
}
