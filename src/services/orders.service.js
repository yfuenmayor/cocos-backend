const boom = require('@hapi/boom');
const { models } = require('../../libs/db/sequelize')
const {isEmpty, isNil, or} = require("ramda");
const { Op } = require('sequelize');
const MarketService = require('./market.service')

class OrdersService {

  constructor() {
    this.OrdersModel = models.Orders
    this.MarketService = new MarketService()
  }


  async getAll(){
    const data = await this.OrdersModel.findAll()
    return data
  }

  async create(data){
    const result = await this.OrdersModel.create(data)
    return result
  }

  async getById(id){
    const data = await this.OrdersModel.findByPk(id)
    if(or(isEmpty(data), isNil(data)))
      throw boom.notFound("instrument not found")
    return data
  }

  async getByUserId(userId){
    const data = await this.OrdersModel.findAll({
      attributes: ['id', 'status','instrumentId', 'side', 'type', 'size', 'price'],
      include: [
        {
          model: models.Users,
          as: 'user',
          required:true,
          attributes: ['id', 'email'],
        },
        {
          model: models.Instruments,
          as: 'instrument',
          required:true,
          attributes: ['id','type','name'],
        }
      ],
      where: {
        [Op.and]: [
          { userId: { [Op.eq]: userId } },
          { status: { [Op.eq]: 'FILLED' } },
        ],
      },
      order: [['id', 'ASC']],
    })
    return data
  }

}

module.exports = OrdersService
