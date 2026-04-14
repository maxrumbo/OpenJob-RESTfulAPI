const Joi = require('joi');

const LoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const RefreshTokenPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const DeleteAuthPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = { LoginPayloadSchema, RefreshTokenPayloadSchema, DeleteAuthPayloadSchema };
