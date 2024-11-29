const { DateTime } = require("luxon")
const boom = require('@hapi/boom')
const { path, mergeDeepRight, equals, pipe, find, propEq, pathOr, multiply} = require('ramda')
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
    this.portfolio = {}
    this.LIMIT = 'LIMIT'
    this.isLimit = false
  }

  #ordersErrors = {
    'OUT': 'Amount to be outflowed exceeds current amount available',
    'SELL': 'does not have sufficient shares for sale',
    'BUY': {
      money:'does not have enough money to buy the shares',
      asset:"the selected stock is not available on the market",
      limit:"the number of shares exceeds the available cash limit"
    }
  }

  #purchaseTransaction = async payload => {
    const {instrumentId, size, price = 0} =  payload
    const status = (this.isLimit) ? 'NEW' : 'FILLED'
    const currentAssetPrice = pipe(find(propEq(instrumentId,'instrumentId')), pathOr(0, ['close']))(this.latestMarkets)
    const assetPrice =  (this.isLimit) ? price : currentAssetPrice

    const availableMoney =  path(['availableMoney'],this.portfolio)

    if(assetPrice === 0)
      return mergeDeepRight(payload,{ status:'REJECTED', price: assetPrice, errorMessage: this.#ordersErrors['BUY']['asset']  })

    if(availableMoney === 0)
      return mergeDeepRight(payload,{ status:'REJECTED', price: assetPrice, errorMessage: this.#ordersErrors['BUY']['money']  })

    const buyPrice = multiply(size,assetPrice)
    if(buyPrice > availableMoney )
      return mergeDeepRight(payload,{ status:'REJECTED', price: assetPrice, errorMessage: this.#ordersErrors['BUY']['limit']  })


    return mergeDeepRight(payload,{ status, price: assetPrice })

  }

  #salesTransaction = async payload => {
    const {instrumentId, size, price = 0} =  payload

    const closePrice = pipe(find(propEq(instrumentId,'instrumentId')), pathOr(0, ['close']))(this.latestMarkets)

    const orderPrice = (this.isLimit) ? price : closePrice
    const status = (this.isLimit) ? 'NEW' : 'FILLED'

    const assets =  path(['assets'],this.portfolio)
    const availableAssetSize =  pipe(find(propEq(instrumentId,'id')), pathOr(0, ['quantity']))(assets)

    if(availableAssetSize === 0 || size > availableAssetSize)
      return mergeDeepRight(payload,{ size, status: 'REJECTED', price: orderPrice, errorMessage: this.#ordersErrors['SELL'] })

    return mergeDeepRight(payload,{ size, status, price: orderPrice })

  }

  #cashWithdrawal = async payload => {
    const availableMoney =  path(['availableMoney'],this.portfolio)

    return (payload.size > availableMoney)
      ? mergeDeepRight(payload,{ ...this.#orderOperations.cashFilled, status: 'REJECTED', errorMessage:this.#ordersErrors['OUT'] })
      : mergeDeepRight(payload,this.#orderOperations.cashFilled)
  }

  #cashInflow = async payload => {
    return mergeDeepRight(payload, this.#orderOperations.cashFilled)
  }

  #orderOperations = {
    'cashFilled': { type: 'MARKET', status: 'FILLED', price: 1 },
    'CASH_IN': payload => this.#cashInflow(payload),
    'CASH_OUT': payload => this.#cashWithdrawal(payload),
    'BUY': payload => this.#purchaseTransaction(payload),
    'SELL': payload => this.#salesTransaction(payload),
  }

  setOrder = async (req, res, next) => {
    const payload = path(['body'], req)
    const { side, userId, type } = payload

    try {

      // validate user
      await this.UserServices.getById(userId)
      // get Porfolio User
      this.portfolio = await this.PortfolioController.getPortfolioByUserId(payload.userId)
      // get Last Market
      this.latestMarkets = await this.MarketServices.getLastPriceMarket() || []
      // validate data
      await this.OrderValidator.postOrders({payload, portfolio: this.portfolio, lastMarkets: this.latestMarkets})

      this.isLimit = equals(`${type}`, 'LIMIT')

      const dataOperation = await this.#orderOperations[side](payload)
      const { errorMessage, ...data } =  dataOperation
      const datetime = DateTime.now().toSQL()

      await this.OrderServices.create(mergeDeepRight(data, {datetime}))

      if(data.status === 'REJECTED')
        throw boom.notAcceptable(errorMessage)

      res.json(data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = OrderController
