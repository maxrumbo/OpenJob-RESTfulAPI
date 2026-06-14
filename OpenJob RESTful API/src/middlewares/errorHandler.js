const multer = require('multer');

const ClientError = require('../exceptions/ClientError');

const errorHandler = (error, req, res, next) => {
  if (error instanceof ClientError) {
    return res.status(error.statusCode).json({
      status: 'failed',
      message: error.message,
    });
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      status: 'failed',
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami',
  });
};

module.exports = errorHandler;
