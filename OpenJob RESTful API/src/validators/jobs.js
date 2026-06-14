const Joi = require('joi');

const jobSchema = Joi.object({
  companyId: Joi.string(),
  company_id: Joi.string(),
  categoryId: Joi.string(),
  category_id: Joi.string(),
  title: Joi.string().min(2).max(150).required(),
  description: Joi.string().required(),
  requirement: Joi.string().allow('', null),
  location: Joi.string().max(150).allow('', null),
  job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance'),
  employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance'),
  employment_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance'),
  experience_level: Joi.string().max(50).allow('', null),
  location_type: Joi.string().max(50).allow('', null),
  location_city: Joi.string().max(150).allow('', null),
  is_salary_visible: Joi.boolean(),
  salaryMin: Joi.number().integer().min(0).allow(null),
  salary_min: Joi.number().integer().min(0).allow(null),
  salaryMax: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(0).allow(null),
  status: Joi.string().valid('open', 'close').default('open'),
})
  .or('companyId', 'company_id')
  .or('categoryId', 'category_id');

const updateJobSchema = Joi.object({
  companyId: Joi.string(),
  company_id: Joi.string(),
  categoryId: Joi.string(),
  category_id: Joi.string(),
  title: Joi.string().min(2).max(150),
  description: Joi.string(),
  requirement: Joi.string().allow('', null),
  location: Joi.string().max(150).allow('', null),
  job_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance'),
  employmentType: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance'),
  employment_type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'freelance'),
  experience_level: Joi.string().max(50).allow('', null),
  location_type: Joi.string().max(50).allow('', null),
  location_city: Joi.string().max(150).allow('', null),
  is_salary_visible: Joi.boolean(),
  salaryMin: Joi.number().integer().min(0).allow(null),
  salary_min: Joi.number().integer().min(0).allow(null),
  salaryMax: Joi.number().integer().min(0).allow(null),
  salary_max: Joi.number().integer().min(0).allow(null),
  status: Joi.string().valid('open', 'close'),
}).min(1);

const jobSearchQuerySchema = Joi.object({
  title: Joi.string().allow('', null),
  'company-name': Joi.string().allow('', null),
});

module.exports = {
  jobSchema,
  updateJobSchema,
  jobSearchQuerySchema,
};
