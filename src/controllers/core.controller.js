// controllers/BaseController.js
const Services = require('../services');
const Helpers = require('../helpers');
const Validators = require('../validators');
const config = require('config')

class Controller extends Services {
  constructor() {
    super()
    this.initServices();
    this.helpers = new Helpers()
    this.config = config
    this.validators = new Validators(this)
  }
}

module.exports = Controller
