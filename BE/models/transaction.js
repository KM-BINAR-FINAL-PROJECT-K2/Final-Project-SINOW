const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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