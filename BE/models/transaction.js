const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
        as: 'user',
      })
      Transaction.belongsTo(models.Course, {
        foreignKey: {
          name: 'courseId',
          allowNull: false,
        },
      })
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      coursePrice: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      promo: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Transaction',
    },
  )
  return Transaction
}
