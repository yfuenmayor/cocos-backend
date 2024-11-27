
const express = require('express')

const assetsRouter = require('./assets.router')
const portfolioRouter = require('./portfolio.router')
const ordersRouter = require('./orders.router')


module.exports = app => {
  const router = express.Router()
  app.use('/api/v1', router)
  router.use('/portfolio', portfolioRouter),
  router.use('/orders', ordersRouter),
  router.use('/assets', assetsRouter)
}
