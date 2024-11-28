const { DateTime } = require("luxon")
const { path, mergeDeepRight, equals, pipe, find, propEq, pathOr} = require('ramda')
const Controller = require('./core.controller')
const PortfolioController = require('./portfolio.controller')


class OrderController extends Controller {

  constructor() {
    super();
    this.OrderServices = this.getService('OrderService')
    this.UserServices = this.getService('UserService')
    this.MarketServices = this.getService('MarketService')
    this.OrderHelpers = this.helpers.get('OrderHelpers')
    this.OrderValidator = this.validators.get('OrderValidator')
    this.PortfolioController = new PortfolioController()
    this.latestMarkets = []
    this.LIMIT = 'LIMIT'
  }

  #orderOperations = {
    'cashFilled': { type: 'MARKET', status: 'FILLED', price: 1 },
    'CASH_IN': async ({payload}) => {
      return mergeDeepRight(payload, this.#orderOperations.cashFilled)
    },
    'CASH_OUT': async ({payload, portfolio}) => {
      const availableMoney =  path(['availableMoney'],portfolio)

      return (payload.size > availableMoney)
        ? mergeDeepRight(payload,{ ...this.#orderOperations.cashFilled, status: 'REJECTED' })
        : mergeDeepRight(payload,this.#orderOperations.cashFilled)
    },
    'BUY': async ({payload}) => {
      const {instrumentId, type, price = 0} =  payload
      const isLimit = equals(type, this.LIMIT)

      const status = (isLimit) ? 'NEW' : 'FILLED'
      const assetPrice =  (isLimit) ? price : pipe(find(propEq(instrumentId,'instrumentId')), pathOr(0, ['close']))(this.latestMarkets)

      return mergeDeepRight(payload,{ status, price: assetPrice })

    },
    'SELL': async ({payload}) => {
      const {instrumentId, type, size, price = 0} =  payload
      const isLimit = equals(type, this.LIMIT)


      const closePricesByAssets = this.latestMarkets.reduce((acc, market) => {
        acc[market.instrumentId] = market.close
        return acc
      },{})

      const closePrice = closePricesByAssets[instrumentId]
      const orderPrice = (isLimit) ? price : closePrice
      const status = (isLimit) ? 'NEW' : 'FILLED'

      return mergeDeepRight(payload,{ size, status, price: orderPrice })

    },
  }

  setOrder = async (req, res, next) => {
    const payload = path(['body'], req)
    const { side, userId } = payload

    try {

      // validate user
      await this.UserServices.getById(userId)
      // get Porfolio User
      const portfolio = await this.PortfolioController.getPortfolioByUserId(payload.userId)
      // get Last Market
      this.latestMarkets = await this.MarketServices.getLastPriceMarket() || []
      // validate data
      await this.OrderValidator.postOrders({payload, portfolio, lastMarkets: this.latestMarkets})


      const data = await this.#orderOperations[side]({payload, portfolio})
      const datetime = DateTime.now().toSQL()

      await this.OrderServices.create(mergeDeepRight(data, {datetime}))

      res.json(data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = OrderController
