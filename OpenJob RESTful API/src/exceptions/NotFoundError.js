const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message = 'Resource tidak ditemukan') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
