const Joi = require('joi')

const userId = Joi.number().integer()

const getPortfolioSchema = Joi.object({
  userId: userId.required()
})

module.exports = {
  getPortfolioSchema
}
