const chai = require('chai')
chai.use( require( 'sinon-chai' ))
const sinon = require('sinon')
const R = require('ramda')
const { expect } = chai
const OrderController = require('../../controllers/orders.controller')
const Models = require('../../../libs/db/models')
const DB = require('../../../libs/db')
const dummyData = require('../Mock/data')

describe('OrderController Functional Tests with Sequelize', () => {
  let OrderControllerInstance, DataBaseInstance, models
  let next, res, req, answers
  let user

  before(async () => {
    models = new Models().models
    answers = dummyData.test
    DataBaseInstance = new DB()

    const dataBase = DataBaseInstance.getConnection()
    await dataBase.sync()

    user = await models.Users.create(dummyData.userTest)
    await models.Instruments.bulkCreate(dummyData.instruments)
    await models.Market.bulkCreate(dummyData.marketData)
    await models.Orders.bulkCreate(dummyData.orders)
    await models.ViMarket.bulkCreate(dummyData.viMarketData)


    user = await models.Users.findByPk(1)

    OrderControllerInstance = new OrderController()

  })

  beforeEach(async () => {
    res = { json: sinon.spy() }
    next = message => { throw message }
    req = { body:  {}}
  })

  after( async () => {
    await DataBaseInstance.closeConnection()
  } )

  describe('setOrder()', async() => {

    it('you must create a CASH_IN command with status FILLED when the user and the wallet are valid.', async () => {
      req.body = { "userId":user.id, "instrumentId": 66, "size": 2, "side": "CASH_IN" }

      await OrderControllerInstance.setOrder(req, res, next)
      const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
      expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body, answers.cashIn))
    })

    it('you must create a CASH_OUT order with status REJECTED when the amount to be withdrawn exceeds the amount available.', async () => {
      req.body = { "userId":user.id, "instrumentId": 66, "size": 6000000000, "side": "CASH_OUT" }

      try{
        await OrderControllerInstance.setOrder(req, res, next)
      } catch(error) {
        const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
        expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body, answers.cashOut))
        expect( error.isBoom ).to.be.true
        expect( error.output.statusCode ).to.be.equal(406)
      }

    })

    it('you must create a SELL order with status FILLED when the user and the wallet are valid.', async () => {
      req.body = { "userId":user.id, "instrumentId": 1, "size": 2, "type": "MARKET", "side":"SELL" }

      await OrderControllerInstance.setOrder(req, res, next)
      const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
      expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body, answers.sellOk))
    })

    it('you must create a SELL order with REJECTED status when the number of shares exceeds the number of shares available.', async () => {
      req.body = { "userId":user.id, "instrumentId": 1, "size": 200, "type": "MARKET", "side":"SELL" }

      try {
        await OrderControllerInstance.setOrder(req, res, next)
      } catch (error){
        const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
        expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body, answers.sellSize))
        expect( error.isBoom ).to.be.true
        expect( error.output.statusCode ).to.be.equal(406)
      }
    })

    it('you must create a BUY command with status FILLED  when the user and the wallet are valid.', async () => {
      req.body = { "userId":user.id, "instrumentId": 1, "size": 20, "type": "MARKET", "side":"BUY" }

      await OrderControllerInstance.setOrder(req, res, next)
      const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
      expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body, answers.sellOk))
    })

    it('you must create a BUY command with status LIMIT  when the user and the wallet are valid.', async () => {
      req.body = { "userId":user.id, "instrumentId": 1, "size": 20, "type": "LIMIT", "side":"BUY", "price": 220.00 }

      await OrderControllerInstance.setOrder(req, res, next)
      const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
      expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body,{status: 'NEW'}))
    })

    it('you must create a BUY-MARKET order with status REJECTED when the total in pesos of the amount of shares to be purchased exceeds the available cash limit. ', async () => {
      req.body = { "userId":user.id, "instrumentId": 1, "size": 20000000, "type": "MARKET", "side":"BUY" }

      try {
        await OrderControllerInstance.setOrder(req, res, next)
      } catch (error){
        const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
        expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body, answers.sellSize))
        expect( error.isBoom ).to.be.true
        expect( error.output.statusCode ).to.be.equal(406)
      }
    })

    it('you must create a BUY-LIMIT order with status REJECTED when the total in pesos of the amount of shares to be purchased exceeds the available cash limit. ', async () => {
      req.body = { "userId":user.id, "instrumentId": 1, "size": 4, "type": "LIMIT", "price": 2500000, "side":"BUY" }

      try {
        await OrderControllerInstance.setOrder(req, res, next)
      } catch (error){
        const { userId, status, type, side, size, price, instrumentId } = await models.Orders.findOne({ order: [['id', 'DESC']] })
        expect( { userId, status, type, side, size, price, instrumentId }).to.be.deep.equal(R.mergeDeepRight(req.body, answers.buyPrice))
        expect( error.isBoom ).to.be.true
        expect( error.output.statusCode ).to.be.equal(406)
      }
    })
  })
})
