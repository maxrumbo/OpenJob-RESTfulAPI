const Joi = require('joi');

const CategoryPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().allow('', null).optional(),
});

module.exports = { CategoryPayloadSchema };
