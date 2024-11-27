const { path, mergeDeepRight } = require('ramda')
const Controller = require('./core.controller')
const PortfolioController = require('./portfolio.controller')

class OrderController extends Controller {

  constructor() {
    super();
    this.OrderServices = this.getService('OrderService')
    this.UserServices = this.getService('UserService')
    this.OrderHelpers = this.helpers.getHelper('OrderHelpers')
    this.PortfolioController = new PortfolioController()
  }

  #orderOperations = {
    'CASH_IN': async (payload, next) => {
      const base = { type: 'MARKET', status: 'FILLED', price: 1 }
      return mergeDeepRight(payload, base)
    },
    'CASH_OUT': async (payload, next) => {
      const { availableMoney } = await this.PortfolioController.getPortfolioByUserId(payload.userId)
      return (payload.size > availableMoney)
        ? mergeDeepRight(payload,{ type: 'MARKET', status: 'REJECTED', price: 1 })
        : mergeDeepRight(payload,{ type: 'MARKET', status: 'FILLED', price: 1 })

    },
    'BUY': async (payload, next) => {

    },
    'SELL': async (payload, next) => {
      // si es SELL entonces MARKET
      // valido si no pasa las que tengo, si pasa la validacion es FILLED sino REJECTED
      // calculo con el ultimo precio
      // preparo body y guardo
    },
  }

  setOrder = async (req, res, next) => {
    const payload = path(['body'], req)
    try {
      await this.UserServices.getById(payload.userId)
      const data = await this.#orderOperations[payload.side](payload, next)



      // const assets = await this.OrderServices.getAll()
      res.json(data)
    } catch (err) {
      next(err)
    }
  }

}

module.exports = OrderController
