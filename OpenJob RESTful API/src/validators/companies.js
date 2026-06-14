const Joi = require('joi');

const companySchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  description: Joi.string().allow('', null),
  website: Joi.string().uri().allow('', null),
  location: Joi.string().max(150).required(),
  industry: Joi.string().max(100).allow('', null),
  size: Joi.string().max(50).allow('', null),
});

module.exports = {
  companySchema,
};
