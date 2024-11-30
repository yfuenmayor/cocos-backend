
 const Calculations = require('./calculations')
 const OrderHelpers = require('./order.helpers')

class Helpers {
  constructor() {
    this.helpers = {};

    this.helpersDefinitions = {
      Calculations,
      OrderHelpers
    }

    for (const [key, HelperClass] of Object.entries(this.helpersDefinitions)) {
      this.helpers[key] = new HelperClass();
    }
  }

  get(helperName) {
    return this.helpers[helperName];
  }
}

module.exports = Helpers;
