const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  fullname: Joi.string().min(2).max(100),
  email: Joi.string().email().max(255),
  username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/),
  password: Joi.string().min(6).required(),
  role: Joi.string().max(30).default('user'),
})
  .or('name', 'fullname')
  .or('email', 'username');

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  fullname: Joi.string().min(2).max(100),
  email: Joi.string().email().max(255),
  username: Joi.string().min(3).max(50).pattern(/^[a-zA-Z0-9_]+$/),
  password: Joi.string().min(6),
  role: Joi.string().max(30),
}).min(1);

module.exports = {
  createUserSchema,
  updateUserSchema,
};
