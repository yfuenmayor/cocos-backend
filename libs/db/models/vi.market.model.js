const { Model, DataTypes } = require('sequelize')
const { INSTRUMENTS_TABLE } = require('./instruments.model')

const VI_MARKETS_TABLE = 'vi_last_marketdata'

const ViMarketSchema = {
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

class ViMarket extends Model {
  static associate() {
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: VI_MARKETS_TABLE,
      modelName: 'ViMarket',
      timestamps: false
    }
  }
  static async create() {
    throw new Error('Cannot create records in a view');
  }

  async update() {
    throw new Error('Cannot update records in a view');
  }

  async destroy() {
    throw new Error('Cannot delete records from a view');
  }
}

module.exports = { ViMarket, ViMarketSchema, VI_MARKETS_TABLE }
