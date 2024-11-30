const boom = require('@hapi/boom');
const {isEmpty, isNil, or} = require("ramda");
const { Op, Sequelize } = require('sequelize');

class MarketService {

  constructor(models) {
    this.MarketModel = models.Market
    this.ViMarketModel = models.ViMarket
  }


  getAll = async () =>{
    const data = await this.MarketModel.findAll()
    return data
  }

  getById = async id =>{
    const data = await this.MarketModel.findByPk(id)
    if(or(isEmpty(data), isNil(data)))
      throw boom.notFound("instrument not found")
    return data
  }

  getLastPriceMarket = async () =>{
    const data = await this.ViMarketModel.findAll()
    return data
  }

  getLastPriceMarketLocal = async () => {
    const data = await this.MarketModel.findAll({
      attributes: ['id', 'instrumentId', 'high', 'low', 'open', 'close', 'previousClose', 'date'],
      where: {
        date: {
          [Op.eq]: Sequelize.literal(`(
                SELECT MAX(date)
                FROM marketdata AS m
                WHERE m.instrumentid = "Market".instrumentId
            )`),
        },
      },
    })
    return data
  }

}

module.exports = MarketService
