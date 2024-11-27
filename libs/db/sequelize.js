const { Sequelize } = require('sequelize')
const config = require('config')
const initModels = require('./models')

const { type, config: dbConfig, auth } = config.get('db')
const { user, password, host, port, dataBase } = auth
const uri = `${type}://${user}:${password}@${host}:${port}/${dataBase}`

const sequelize = new Sequelize(uri, {...dbConfig})

initModels(sequelize)
sequelize.sync({ alter: false, force: false })

module.exports = sequelize
