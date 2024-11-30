const { pathOr } = require('ramda')
const Controller = require('./core.controller')

class AssetsController extends Controller {

  constructor() {
    super()
    this.assets = this.getService('AssetsService')
  }

  getAllMarket = async (req, res, next) => {
    const searchText = `%${pathOr('',['query', 'str'])(req)}%`
    try {
      const assets = await this.assets.getAllMarket(searchText)
      res.json(assets)
    } catch (err) {
      next(err)
    }
  }

  getLastMarket = async (req, res, next) => {
    const searchText = `%${pathOr('',['query', 'str'])(req)}%`
    try {
      const assets = await this.assets.getLastMarket(searchText)
      res.json(assets)
    } catch (err) {
      next(err)
    }
  }




}

module.exports = AssetsController
