const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  OTP.init(
    {
      userId: DataTypes.INTEGER,
      userEmail: DataTypes.STRING,
      otpValue: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'OTP',
    },
  )
  return OTP
}
