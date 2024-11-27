const { path, pipe, reduce } = require('ramda')
const Controller = require('./core.controller')
class PortfolioController extends Controller {

  constructor() {
    super();
    this.OrderServices = this.getService('OrderService')
    this.MarketServices = this.getService('MarketService')
    this.UserServices = this.getService('UserService')
    this.Calculations = this.helpers.getHelper('Calculations')
  }

  getAll = async (req, res, next) => {
    try {
      const assets = await this.OrderServices.getAll()
      res.json(assets)
    } catch (err) {
      next(err)
    }
  }

  getByUserId = async (req, res, next) => {
    const userId = pipe(path(['params', 'userId']), parseInt)(req) || 0
    try {

      const user = await this.UserServices.getById(userId)
      const ordersByUser = await this.OrderServices.getByUserId(user.id)
      const latestMarkets = await this.MarketServices.getLastPriceMarket() || []

      const closePricesByInstruments = latestMarkets.reduce((acc, market) => {
        acc[market.instrumentId] = market.close
        return acc
      },{})

      const availableMoney = reduce( this.Calculations.getTotalMoneyByUser, 0, ordersByUser)
      const { assets , assetsValue }  = this.Calculations.calculateAssetsByUser(ordersByUser,closePricesByInstruments)

      const response = {
        userId: userId,
        totalBalance: availableMoney + assetsValue,
        availableMoney,
        assets
      }

      res.json(response)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = PortfolioController
