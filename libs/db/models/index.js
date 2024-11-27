const { User, UserSchema} = require('./users.model')
const { Order, OrderSchema} = require('./orders.model')
const { Market, MarketSchema} = require('./market.model')
const { ViMarket, ViMarketSchema} = require('./vi.market.model')
const { Instrument, InstrumentSchema } = require('./instruments.model')

const initModels = sequelize => {
  const { models } = sequelize
  User.init(UserSchema, User.config(sequelize))
  Order.init(OrderSchema, Order.config(sequelize))
  Instrument.init(InstrumentSchema, Instrument.config(sequelize))
  Market.init(MarketSchema, Market.config(sequelize))
  ViMarket.init(ViMarketSchema, ViMarket.config(sequelize))

  //Association
  Instrument.associate(models)
  Market.associate(models)
  User.associate(models)
  Order.associate(models)
}

module.exports = initModels
