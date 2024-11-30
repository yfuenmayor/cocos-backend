const { User, UserSchema} = require('./users.model')
const { Order, OrderSchema} = require('./orders.model')
const { Market, MarketSchema} = require('./market.model')
const { ViMarket, ViMarketSchema} = require('./vi.market.model')
const { Instrument, InstrumentSchema } = require('./instruments.model')
const DataBase = require('../index')

class Models extends DataBase {
  static instance

  constructor() {
    super()

    if(Models.instance)
      return Models.instance

    User.init(UserSchema, User.config(this.sequelize))
    Order.init(OrderSchema, Order.config(this.sequelize))
    Instrument.init(InstrumentSchema, Instrument.config(this.sequelize))
    Market.init(MarketSchema, Market.config(this.sequelize))
    ViMarket.init(ViMarketSchema, ViMarket.config(this.sequelize))

    //Association
    const { models } = this.sequelize
    Instrument.associate(models)
    Market.associate(models)
    User.associate(models)
    Order.associate(models)

    this.sequelize.sync({ alter: false, force: false })

    this.models = models

    Models.instance = this
  }
}

module.exports = Models
