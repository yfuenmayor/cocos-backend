// controllers/BaseController.js
const Services = require('../services');
const Helpers = require('../helpers');

class Controller extends Services {
  constructor() {
    super();
    this.initServices();
    this.helpers = new Helpers()
  }
}

module.exports = Controller
