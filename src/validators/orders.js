const { includes, path, pipe, find, propEq, pathOr, equals, multiply} = require("ramda");
const boom = require("@hapi/boom");

class OrderValidator  {
  constructor(controllerInstance){
    this.data = {}
    this.AssetsService = controllerInstance.getService('AssetsService')
    this.current = controllerInstance.config.get('api.currency.market.ticker')
    this.LIMIT = 'LIMIT'
  }

  #validateCashOrder = async ({payload: { instrumentId }}) => {
      const { ticker } = await this.AssetsService.getInstrumentById(instrumentId)
      if(`${ticker}` !== `${this.current}`)
        throw boom.notAcceptable("incorrect instrumentId")
    }

  #validateBuyOrder = async ({payload, portfolio, lastMarkets}) => {
    let cashLimit = false
    const size =  path(['size'],payload)
    const instrumentId =  path(['instrumentId'],payload)
    const side =  pathOr(0,['side'],payload)

    const availableMoney =  path(['availableMoney'],portfolio)
    if(availableMoney === 0 )
      throw boom.notAcceptable("you have no money to operate")

    const currentAssetPrice =  pipe(find(propEq(instrumentId,'instrumentId')), pathOr(0, ['close']))(lastMarkets)
    if(currentAssetPrice === 0 )
      throw boom.notAcceptable("the selected stock is not available on the market")

    if(equals(side, this.LIMIT)){
      const price =  pathOr(0,['price'],payload)
      const totalOrderPrice = multiply(size, price)
      if(totalOrderPrice() > availableMoney) cashLimit = true
    } else {
      const totalCurrentPrice = multiply(size, currentAssetPrice)
      if(totalCurrentPrice > availableMoney) cashLimit = true
    }

    if(cashLimit)
      throw boom.notAcceptable("the number of shares exceeds the available cash limit")



  }

  #validateSellOrder = async ({payload, portfolio}) => {
    const instrumentId =  path(['instrumentId'],payload)
    const assets =  path(['assets'],portfolio)
    const availableAssetSize =  pipe(find(propEq(instrumentId,'instrumentId')), pathOr(0, ['quantity']))(assets)
    const sellSize =  path(['size'],payload)

    if(availableAssetSize === 0 )
      throw boom.notAcceptable("the user has no shares of this type")

    if(sellSize > availableAssetSize)
      throw boom.notAcceptable("does not have the required number of shares for sale")

  }



  postOrders = async data => {
    const { side } = path(['payload'], data)

    if(includes('CASH_', side))
      await this.#validateCashOrder(data)

    if(includes('BUY', side))
      await this.#validateBuyOrder(data)

    if(includes('SELL', side))
      await this.#validateSellOrder(data)
  }

}

module.exports = OrderValidator
