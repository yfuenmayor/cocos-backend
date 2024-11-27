const express = require('express')
const router = express.Router()
const AssetsController = require('../controllers/assets.controller')
const validatorData = require('../middelwares/validator.data')
const { getSearchSchema } = require('../schemas/assets.schema')


const controller = new AssetsController()

router.get(
  '/search',
  validatorData(getSearchSchema, 'query'),
  controller.getAllMarket
)

router.get(
  '/last/search',
  validatorData(getSearchSchema, 'query'),
  controller.getLastMarket
)

module.exports = router
