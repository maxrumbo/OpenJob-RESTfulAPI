const jobsService = require('../services/jobsService');

const createJob = async (req, res, next) => {
  try {
    const jobId = await jobsService.addJob(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Job created successfully',
      data: { jobId },
    });
  } catch (error) {
    return next(error);
  }
};

const getJobs = async (req, res, next) => {
  try {
    const { title } = req.query;
    const companyName = req.query['company-name'];
    const jobs = await jobsService.getJobs({ title, companyName });
    return res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  } catch (error) {
    return next(error);
  }
};

const getJobById = async (req, res, next) => {
  try {
    const job = await jobsService.getJobById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { job },
    });
  } catch (error) {
    return next(error);
  }
};

const getJobsByCompanyId = async (req, res, next) => {
  try {
    const jobs = await jobsService.getJobsByCompanyId(req.params.companyId);
    return res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  } catch (error) {
    return next(error);
  }
};

const getJobsByCategoryId = async (req, res, next) => {
  try {
    const jobs = await jobsService.getJobsByCategoryId(req.params.categoryId);
    return res.status(200).json({
      status: 'success',
      data: { jobs },
    });
  } catch (error) {
    return next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    await jobsService.editJobById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Job updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    await jobsService.deleteJobById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: 'Job deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createJob, getJobs, getJobById, getJobsByCompanyId, getJobsByCategoryId, updateJob, deleteJob };
