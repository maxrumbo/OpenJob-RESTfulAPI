const Joi = require('joi');

const JobPayloadSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().allow('', null).optional(),
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  location: Joi.string().allow('', null).optional(),
  type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship').optional(),
  salary_range: Joi.string().allow('', null).optional(),
});

module.exports = { JobPayloadSchema };
