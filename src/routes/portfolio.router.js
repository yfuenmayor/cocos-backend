const express = require('express')
const router = express.Router()
const PortfolioController = require('../controllers/portfolio.controller')
const validatorData = require('../middelwares/validator.data')
const { getPortfolioSchema } = require('../schemas/portfolio.schema')

const controller = new PortfolioController()

router.get(
  '/:userId',
  validatorData(getPortfolioSchema, 'params'),
  controller.getByUserId
)

module.exports = router
