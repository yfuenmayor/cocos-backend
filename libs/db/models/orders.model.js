const { Model, DataTypes, Sequelize } = require('sequelize')
const { INSTRUMENTS_TABLE} = require("./instruments.model");
const { USERS_TABLE} = require("./users.model");

const ORDERS_TABLE = 'orders'

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  instrumentId: {
    field: 'instrumentid',
    type: DataTypes.INTEGER,
    references: {
      model: INSTRUMENTS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  userId: {
    field: 'userid',
    type: DataTypes.INTEGER,
    references: {
      model: USERS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
 size: {
    // allowNull: false,
    type: DataTypes.INTEGER,
  },
  price: {
    // allowNull: false,
    type: DataTypes.DECIMAL(10,2),
  },
  type: {
    // allowNull: false,
    type: DataTypes.STRING(10)
  },
  side: {
    // allowNull: false,
    type: DataTypes.STRING(10)
  },
  status: {
    // allowNull: false,
    type: DataTypes.STRING(20)
  },
  datetime: {
    // allowNull: false,
    type: DataTypes.DATE
  }

}

class Order extends Model {
  static associate(models) {
    this.belongsTo(models.Users, { as: 'user' })
    this.belongsTo(models.Instruments, { as: 'instrument' })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDERS_TABLE,
      modelName: 'Orders',
      timestamps: false
    }
  }
}

module.exports = { Order, OrderSchema, ORDERS_TABLE }
