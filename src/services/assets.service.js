const {Op} = require("sequelize");
const {or, isEmpty, isNil} = require("ramda");
const boom = require("@hapi/boom");

class AssetsService {

  constructor(models) {
    this.InstumentsModel = models.Instruments
    this.ViMarketModel = models.ViMarket
    this.MarketModel = models.Market
  }

  async getInstrumentById(id) {
    const instrument = await this.InstumentsModel.findByPk(id)

    if(or(isEmpty(instrument), isNil(instrument)))
      throw boom.notFound("instrument not found")

    return instrument
}

  async getAllMarket(searchText){
    const data = await this.InstumentsModel.findAll({
      attributes: ['id', 'ticker', 'name' ],
      include: [{
        model: this.MarketModel,
        as: 'market',
        required:true,
        attributes: ['high', 'low', 'open', 'close' ],
      }],
      where: {
        [Op.or]: [
          { ticker: { [Op.like]: searchText } },
          { name: { [Op.like]: searchText } },
        ],
      },
      order: [['id', 'ASC']],
    })
    return data
  }

  async getLastMarket(searchText){
    const data = await this.InstumentsModel.findAll({
      attributes: ['id', 'ticker', 'name' ],
      include: [{
        model: this.ViMarketModel,
        as: 'viMarket',
        required:true,
        attributes: ['high', 'low', 'open', 'close' ],
      }],
      where: {
        [Op.or]: [
          { ticker: { [Op.like]: searchText } },
          { name: { [Op.like]: searchText } },
        ],
      },
      order: [['id', 'ASC']],
    })
    return data
  }

}

module.exports = AssetsService
