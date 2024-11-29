const Joi = require('joi')
const config = require('config')

const { types, sides } = config.get('api.orders.schemas')

const userId = Joi.number().integer().positive()
const instrumentId = Joi.number().integer().positive()
const size = Joi.number().integer().positive()
const price = Joi.number().positive().precision(2)
const type = Joi.string().valid(...types)
const side = Joi.string().valid(...sides.all)

const setOrderSchema = Joi.object({
  userId: userId.required(),
  instrumentId: instrumentId.required(),
  size: size.required(),
  side: side.required(),
  type: type.when('side', {
    is: Joi.valid(...sides.cash),
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  price: price.when('type', {
    is: types[1],
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
})

module.exports = {
  setOrderSchema
}
