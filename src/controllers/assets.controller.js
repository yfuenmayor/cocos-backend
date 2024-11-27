const { pathOr } = require('ramda')
const AssetService = require('../services/assets.service')

class AssetsController {

  constructor() {
    this.assets = new AssetService();
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
