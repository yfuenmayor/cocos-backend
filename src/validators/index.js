const OrderValidator = require('./orders')

class Validators {
  constructor(controllerInstance) {
    this.validators = {}

    this.validatorsDefinitions = {
      OrderValidator
    }

    for (const [key, ValidatorClass] of Object.entries(this.validatorsDefinitions)) {
      this.validators[key] = new ValidatorClass(controllerInstance)
    }
  }

  get = validatorName => {
    return this.validators[validatorName]
  }
}

module.exports = Validators
