const { Sequelize } = require('sequelize')
const config = require('config')
const initModels = require('./models')

class Database {
  static instance


  constructor(){
    if(Database.instance)
      return Database.instance

    const { type, config: dbConfig, auth } = config.get('db')
    const { user, password, host, port, dataBase } = auth
    const uri = `${type}://${user}:${password}@${host}:${port}/${dataBase}`

    this.sequelize = new Sequelize(uri, {...dbConfig})

    initModels(this.sequelize)
    this.sequelize.sync({ alter: false, force: false })

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
}

module.exports = Database
