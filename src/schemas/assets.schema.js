const Joi = require('joi')

const str = Joi.string().trim()

const getSearchSchema = Joi.object({
  str: str.required()
})

module.exports = {
  getSearchSchema
}
