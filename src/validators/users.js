const Joi = require('joi');

const UserRegisterPayloadSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().min(1).max(255).required(),
});

module.exports = { UserRegisterPayloadSchema };
