const OrderService = require('./orders.service')
const MarketService = require('./market.service')
const UserService = require('./users.service')
const AssetsService = require('./assets.service')
const Models = require('../../libs/db/models')

class Services extends Models {
  constructor() {
    super()
    this.services = {};
    this.serviceDefinitions = {
      OrderService,
      AssetsService,
      UserService,
      MarketService,
    }
  }

  initServices = () => {
    for (const [key, ServiceClass] of Object.entries(this.serviceDefinitions)) {
      this.services[key] = new ServiceClass(this.models);
    }
  }

  getService = serviceName => {
    return this.services[serviceName];
  }
}

module.exports = Services;
