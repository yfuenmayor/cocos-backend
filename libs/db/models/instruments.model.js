const { Model, DataTypes } = require('sequelize')

const INSTRUMENTS_TABLE = 'instruments'

const InstrumentSchema = {
  id: {
    primaryKey: true,
    unique: true,
    type: DataTypes.INTEGER,
  },
  ticker: {
    // allowNull: false,
    // unique: true,
    type: DataTypes.STRING(10),
  },
  name: {
    // allowNull: false,
    // unique: true,
    type: DataTypes.STRING(255),
  },
  type: {
    // allowNull: false,
    type: DataTypes.STRING(10),
  },
}

class Instrument extends Model {
  static associate(models) {
    this.hasOne(models.Market,{ as: 'market', foreignKey:'instrumentid'})
    this.hasOne(models.ViMarket,{ as: 'viMarket' , foreignKey:'instrumentid'})
  }
  static config(sequelize) {
    return {
      sequelize,
      tableName: INSTRUMENTS_TABLE,
      modelName: 'Instruments',
      timestamps: false
    }
  }
}

module.exports = { Instrument, InstrumentSchema, INSTRUMENTS_TABLE }
