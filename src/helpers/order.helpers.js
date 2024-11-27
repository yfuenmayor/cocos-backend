const R = require('ramda')
const {groupBy, reduce} = require("ramda");

class OrderHelpers {
  constructor(){

  }

  getStatusOrder = ({type}) => {
    const statusMaping = ['NEW','FILLED','REJECTED', 'CANCELLED']
    if( type === 'LIMIT' ) return statusMaping[0]
  }

}

module.exports = OrderHelpers
