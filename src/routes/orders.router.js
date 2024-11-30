const express = require('express')
const router = express.Router()
const OrderController = require('../controllers/orders.controller')
const validatorData = require('../middelwares/validator.data')
const { setOrderSchema } = require('../schemas/orders.schema')

const controller = new OrderController()

router.post(
  '/',
  validatorData(setOrderSchema, 'body'),
  controller.setOrder
)

module.exports = router
