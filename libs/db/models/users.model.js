const { Model, DataTypes } = require('sequelize')

const USERS_TABLE = 'users'

const UserSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    // allowNull: false,
    // unique: true,
    type: DataTypes.STRING(255),
  },
  accountnumber: {
    // allowNull: false,
    // unique: true,
    type: DataTypes.STRING(20),
  }
}

class User extends Model {
  static associate(models) {
      this.hasMany(models.Orders, {
        as: 'orders',
        foreignKey: 'userid'
      })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: USERS_TABLE,
      modelName: 'Users',
      timestamps: false
    }
  }
}

module.exports = { User, UserSchema, USERS_TABLE }
