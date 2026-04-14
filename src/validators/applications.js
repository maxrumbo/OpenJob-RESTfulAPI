const Joi = require('joi');

const ApplicationCreatePayloadSchema = Joi.object({
  job_id: Joi.string().required(),
  cover_letter: Joi.string().allow('', null).optional(),
});

const ApplicationUpdatePayloadSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'reviewed', 'accepted', 'rejected')
    .required(),
});

module.exports = { ApplicationCreatePayloadSchema, ApplicationUpdatePayloadSchema };
