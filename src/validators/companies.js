const Joi = require('joi');

const CompanyPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  location: Joi.string().allow('', null).optional(),
  logo_url: Joi.string().uri().allow('', null).optional(),
});

module.exports = { CompanyPayloadSchema };
