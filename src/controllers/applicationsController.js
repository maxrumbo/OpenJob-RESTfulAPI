const applicationsService = require('../services/applicationsService');

const createApplication = async (req, res, next) => {
  try {
    const userId = req.userId;
    const applicationId = await applicationsService.addApplication({
      userId,
      ...req.body,
    });
    return res.status(201).json({
      status: 'success',
      message: 'Application submitted successfully',
      data: { applicationId },
    });
  } catch (error) {
    return next(error);
  }
};

const getApplications = async (req, res, next) => {
  try {
    const applications = await applicationsService.getApplications();
    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    return next(error);
  }
};

const getApplicationById = async (req, res, next) => {
  try {
    const application = await applicationsService.getApplicationById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { application },
    });
  } catch (error) {
    return next(error);
  }
};

const getApplicationsByUserId = async (req, res, next) => {
  try {
    const applications = await applicationsService.getApplicationsByUserId(req.params.userId);
    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    return next(error);
  }
};

const getApplicationsByJobId = async (req, res, next) => {
  try {
    const applications = await applicationsService.getApplicationsByJobId(req.params.jobId);
    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    return next(error);
  }
};

const updateApplication = async (req, res, next) => {
  try {
    await applicationsService.editApplicationById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Application updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    await applicationsService.deleteApplicationById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: 'Application deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createApplication, getApplications, getApplicationById,
  getApplicationsByUserId, getApplicationsByJobId,
  updateApplication, deleteApplication,
};
