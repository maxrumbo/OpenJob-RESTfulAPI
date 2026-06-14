const Joi = require('joi');

const createApplicationSchema = Joi.object({
  jobId: Joi.string(),
  job_id: Joi.string(),
  documentId: Joi.string().allow(null),
  document_id: Joi.string().allow(null),
  coverLetter: Joi.string().allow('', null),
  cover_letter: Joi.string().allow('', null),
})
  .or('jobId', 'job_id');

const updateApplicationSchema = Joi.object({
  status: Joi.string().valid('pending', 'reviewed', 'accepted', 'rejected').required(),
});

module.exports = {
  createApplicationSchema,
  updateApplicationSchema,
};
