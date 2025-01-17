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
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      noOrder: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      coursePrice: DataTypes.INTEGER,
      discountPrice: DataTypes.INTEGER,
      taxPrice: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
      promoDiscountPercentage: DataTypes.INTEGER,
      taxPercentage: {
        type: DataTypes.INTEGER,
        defaultValue: 11,
      },
      paymentUrl: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      status: DataTypes.STRING,
      paidAt: DataTypes.DATE,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Transaction',
    },
  )
  return Transaction
}
