const express = require('express')
const config = require('config')
const cors = require('cors')
const routerApi = require('./src/routes')
const middlewares = require('./src/middelwares')
const Database = require('./libs/db')


const app = express()
const portConfig = config.get('port')
const port = portConfig || 3000


/**
 * limiting domains for api use

const whitelist = ['https://example']
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('no permitido'), false);
    }
  }
}
app.use(cors(options));

 */

const dbInstance = new Database()
dbInstance.testConnection()


app.use(cors())
app.use(express.json({ extended: true}))

routerApi(app)

app.use(middlewares.logErrors)
app.use(middlewares.ormErrors)
app.use(middlewares.boomErrors)
app.use(middlewares.parseErrors)

app.listen(port, () => console.log(`listening on ${port}`) )

// Manejo de eventos para cerrar la conexión al terminar la aplicación

const gracefulShutdown = () => {
  console.log('Graceful shutdown initiated...');
  dbInstance.closeConnection();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('exit', () => {
  dbInstance.closeConnection();
})

