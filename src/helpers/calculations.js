const R = require('ramda')
const {groupBy, reduce} = require("ramda");

class Calculations {
  constructor(){

  }

  #orderOperationStrategy = {
    'CASH_IN': ({total, size}) => R.add(total, size),
    'CASH_OUT': ({total, size}) => R.subtract(total, size),
    'BUY': ({total, price, size}) => R.subtract(total, R.multiply(size ,price)),
    'SELL': ({total, price, size}) => R.add(total, R.multiply(size ,price)),
  }

  getTotalMoneyByUser = (total, {size,price, side} ) => this.#orderOperationStrategy[side]({total, price: parseFloat(price), size})

  #calculateAveragePromTotal = (count, total, totalCount) => R.pipe(
    R.divide(total),
    R.multiply(count)
  )(totalCount)

  totalYield = (initValue, currentValue) =>
    R.pipe(
      R.subtract(currentValue),
      R.divide(R.__, initValue),
      R.multiply(100),
      R.invoker(1, 'toFixed')(2)
    )(initValue);

  calculateAssetsByUser = (orders, prices) => {
    const groupedByInstrument = groupBy(
      (order) => order.instrument.name,
      orders.filter((order) => order.instrument.type === 'ACCIONES')
    );

    return reduce((acc,orders) => {
      const asset = R.head(orders)
      const name = R.path(['instrument','name'],asset)
      const id = R.path(['instrument','id'],asset)
      const instrumentId = R.path(['instrumentId'],asset)
      const currentPrice = prices[instrumentId]

      const { size, totalBuy, totalBuySize } = reduce(
        (acc, {size, side, price}) => {
          const isBuy = side === 'BUY'
          acc.size +=  isBuy ? size : -size
          acc.totalBuySize += isBuy ? size : 0
          acc.totalBuy += isBuy ? R.multiply(parseFloat(price), size) : 0
          return acc
        },
        { size: 0, totalBuy: 0, totalBuySize: 0 },
        orders
      )

      const currentValue = R.multiply(size ,parseFloat(currentPrice))
      const promIniBuy = this.#calculateAveragePromTotal(size, totalBuy, totalBuySize)
      const totalYield = this.totalYield(promIniBuy, currentValue)

      acc.assetsValue += currentValue
      acc.assets.push({
        id,
        assetName: name,
        quantity:size,
        currentValue,
        'totalYield (%)': `${totalYield}`,
      })

      return acc
    },{ assets: [], assetsValue: 0}, Object.values(groupedByInstrument))
  }

}

module.exports = Calculations
