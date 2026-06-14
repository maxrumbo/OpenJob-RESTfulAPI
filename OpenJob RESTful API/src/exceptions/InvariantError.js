const ClientError = require('./ClientError');

class InvariantError extends ClientError {
  constructor(message = 'Permintaan tidak valid') {
    super(message, 400);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
