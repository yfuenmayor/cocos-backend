const OrderService = require('./orders.service')
const MarketService = require('./market.service')
const UserService = require('./users.service')
const AssetsService = require('./assets.service')

class Services {
  constructor() {
    this.services = {};
    this.serviceDefinitions = {
      OrderService,
      MarketService,
      AssetsService,
      UserService
    }
  }

  initServices() {
    for (const [key, ServiceClass] of Object.entries(this.serviceDefinitions)) {
      this.services[key] = new ServiceClass();
    }
  }

  getService(serviceName) {
    return this.services[serviceName];
  }
}

module.exports = Services;
