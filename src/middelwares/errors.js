const { ValidationError } = require('sequelize')

const logErrors = (error, _req, _res, next) => {
  //TODO: aws.log
  console.error(error)

  next(error)
}

const parseErrors = (error, _req, res, _next) => res.status(500).json({message: error.message})


const boomErrors = (error, _req, res, next) => {

  if(!error.isBoom)
    next(error)

  const { output: { statusCode, payload } } = error
  res.status(statusCode).json(payload)

}

const ormErrors = (error, _req, res, next) => {
  if(error instanceof ValidationError){
    res.status(409).json({
      statusCode: 409,
      message: error.name,
      errors: error.errors
    })
  }
  next(error)
}

module.exports = {
  logErrors,
  parseErrors,
  ormErrors,
  boomErrors
}
