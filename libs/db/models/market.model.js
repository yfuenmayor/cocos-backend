const { Model, DataTypes } = require('sequelize')
const { INSTRUMENTS_TABLE } = require('./instruments.model')

const MARKETS_TABLE = 'marketdata'

const MarketSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  instrumentId: {
    field: 'instrumentid',
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: INSTRUMENTS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  high: {
    type: DataTypes.DECIMAL(10,2),
  },
  low: {
    type: DataTypes.DECIMAL(10,2),
  },
  open: {
    type: DataTypes.DECIMAL(10,2),
  },
  close: {
    type: DataTypes.DECIMAL(10,2),
  },
  previousClose: {
    field: 'previousclose',
    type: DataTypes.DECIMAL(10,2),
  },
  date: {
    type: DataTypes.DATE
  }
}

class Market extends Model {
  static associate(models) {
    this.belongsTo(models.Instruments, { as: 'instrument', foreignKey: 'instrumentid' })
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: MARKETS_TABLE,
      modelName: 'Market',
      timestamps: false
    }
  }
}

module.exports = { Market, MarketSchema, MARKETS_TABLE }
