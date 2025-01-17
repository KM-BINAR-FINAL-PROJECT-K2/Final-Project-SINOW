const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Notification.belongsTo(models.User, {
        foreignKey: {
          name: 'userId',
          allowNull: false,
        },
      })
    }
  }
  Notification.init(
    {
      type: DataTypes.STRING,
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      isRead: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Notification',
    },
  )
  return Notification
}
