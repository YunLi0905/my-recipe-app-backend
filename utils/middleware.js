const logger = require("./logger")

const requestLogger = (req, res, next) => {
  console.log("Method: ", req.method)
  console.log("Path: ", req.path)
  console.log("Body: ", req.body)
  console.log("---")
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
