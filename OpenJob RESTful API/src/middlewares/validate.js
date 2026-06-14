const InvariantError = require('../exceptions/InvariantError');

const validate = (schema, property = 'body') => (req, res, next) => {
  const validationResult = schema.validate(req[property], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (validationResult.error) {
    const message = validationResult.error.details.map((detail) => detail.message).join(', ');
    return next(new InvariantError(message));
  }

  req[property] = validationResult.value;
  return next();
};

module.exports = validate;
