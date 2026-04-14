const InvariantError = require('../utils/InvariantError');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    console.log('PAYLOAD:', req[property]);
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      throw new InvariantError(message);
    }

    next();
  };
};

module.exports = validate;
