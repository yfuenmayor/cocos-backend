
 const Calculations = require('./calculations')

class Helpers {
  constructor() {
    this.helpers = {};

    this.helpersDefinitions = {
      Calculations,
    }

    for (const [key, HelperClass] of Object.entries(this.helpersDefinitions)) {
      this.helpers[key] = new HelperClass();
    }
  }

  getHelper(helperName) {
    return this.helpers[helperName];
  }
}

module.exports = Helpers;
