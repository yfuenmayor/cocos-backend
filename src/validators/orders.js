const { includes, path } = require("ramda");
const boom = require("@hapi/boom");

class OrderValidator  {
  constructor(controllerInstance){
    this.data = {}
    this.AssetsService = controllerInstance.getService('AssetsService')
    this.current = {
      ticker: controllerInstance.config.get('api.currency.market.ticker'),
      id:  controllerInstance.config.get('api.currency.market.id')
    }
  }

  #validateCashOrder = async ({payload: { instrumentId }}) => {
      const { ticker } = await this.AssetsService.getInstrumentById(instrumentId)
      if(`${ticker}` !== `${this.current.ticker}`)
        throw boom.notAcceptable("incorrect instrumentId")
    }

  #validateBuyOrder = async ({payload}) => {
    const instrumentId =  path(['instrumentId'],payload)

    if(`${instrumentId}` === `${this.current.id}`)
      throw boom.notAcceptable("incorrect instrumentId")

  }

  #validateSellOrder = async ({payload}) => {
    const instrumentId =  path(['instrumentId'],payload)

    if(`${instrumentId}` === `${this.current.id}`)
      throw boom.notAcceptable("incorrect instrumentId")

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
