const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  constructor(message = 'Anda tidak berhak mengakses resource ini') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
