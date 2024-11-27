const { models } = require('../../libs/db/sequelize')
const {Op} = require("sequelize");

class AssetsService {

  constructor() {
    this.instruments = models.Instruments
  }

  async getAllMarket(searchText){
    const data = await this.instruments.findAll({
      attributes: ['id', 'ticker', 'name' ],
      include: [{
        model: models.Market,
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
    const data = await this.instruments.findAll({
      attributes: ['id', 'ticker', 'name' ],
      include: [{
        model: models.ViMarket,
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
