const express = require('express')
const config = require('config')
const cors = require('cors')
const routerApi = require('./src/routes')
const middlewares = require('./src/middelwares')
// const Database = require('./libs/db')


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

app.use(cors())
app.use(express.json({ extended: true}))

routerApi(app)

app.use(middlewares.logErrors)
app.use(middlewares.ormErrors)
app.use(middlewares.boomErrors)
app.use(middlewares.parseErrors)

app.listen(port, () => console.log(`listening on ${port}`) )

// TODO: agregar el proccess.on, para cerrar la base de datos cuando se termine o se caiga el servicio. SIGTERM SIGINT
