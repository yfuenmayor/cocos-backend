const R = require('ramda')
const {groupBy, reduce} = require("ramda");

class Calculations {
  constructor(){

  }

  #orderOperations = {
    'CASH_IN': ({total, size}) => total + size,
    'CASH_OUT': ({total, size}) => total - size,
    'BUY': ({total, price, size}) => total - (size * price),
    'SELL': ({total, price, size}) => total + (size * price),
  }

  getTotalMoneyByUser = (total, {size,price, side} ) => this.#orderOperations[side]({total, price: parseFloat(price), size})

  #calculateAveragePromTotal = (count, total, totalCount) => {
    const average = R.divide(total, totalCount)
    const totalAverage = R.multiply(average, count)
    return totalAverage
  }

  calculateAssetsByUser = (orders, prices) => {
    const groupedByInstrument = groupBy(
      (order) => order.instrument.name,
      orders.filter((order) => order.instrument.type === 'ACCIONES')
    );

    return reduce((acc,orders) => {
      const name = orders[0].instrument.name
      const instrumentId = orders[0].instrumentId
      const actualPrice = prices[instrumentId]

      const { size, totalBuy, totalBuySize } = reduce(
        (acc, {size, side, price}) => {
          const isBuy = side === 'BUY'
          acc.size +=  isBuy ? size : -size
          acc.totalBuySize += isBuy ? size : 0
          acc.totalBuy += isBuy ? parseFloat(price) * size : 0
          return acc
        },
        { size: 0, totalBuy: 0, totalBuySize: 0 },
        orders
      )

      const totalValue = size * parseFloat(actualPrice)
      const promIniBuy = this.#calculateAveragePromTotal(size, totalBuy, totalBuySize)
      const percentage = (((totalValue-promIniBuy) / promIniBuy) * 100).toFixed(2)

      acc.assetsValue += totalValue
      acc.assets.push({
        assetName: name,
        quantity:size,
        totalValue,
        'totalYield (%)': `${percentage}`,
      })

      return acc
    },{ assets: [], assetsValue: 0}, Object.values(groupedByInstrument))
  }

}

module.exports = Calculations
