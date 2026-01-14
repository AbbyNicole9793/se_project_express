const { UNAUTHORIZED_USER } = require("./errors");

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_USER;
  }
}

module.exports = ForbiddenError;