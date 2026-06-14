const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email(),
  username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/),
  password: Joi.string().required(),
}).or('email', 'username');

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  loginSchema,
  refreshTokenSchema,
};
