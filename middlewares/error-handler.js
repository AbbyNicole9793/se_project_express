const { SERVER_ERROR } = require("../errors/errors");

function errorHandler(err, req, res, next) {
  console.error(err);

  const statusCode = err.statusCode || SERVER_ERROR;

  const message = err.message || 'Internal Server Error';

  res.status(statusCode).send({ message });
}

module.exports = errorHandler;