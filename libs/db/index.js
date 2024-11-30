const { Sequelize } = require('sequelize')
const config = require('config')

class Database {
  static instance

  constructor(){
    if(Database.instance)
      return Database.instance

    const { config: dbConfig, uri } = config.get('db')

    this.sequelize = new Sequelize(uri, {...dbConfig})

    Database.instance = this
  }

  getConnection = () => {
    return this.sequelize
  }

  testConnection = () => {
    try {
      this.sequelize.authenticate()
      console.log('connected database')
    } catch (error) {
      console.error(error)
    }
  }

  closeConnection = () => {
    try {
      this.sequelize.close();
      console.log('Database connection closed.')
    } catch (error) {
      console.error('Error closing database connection:', error)
    }
  };
}

module.exports = Database
