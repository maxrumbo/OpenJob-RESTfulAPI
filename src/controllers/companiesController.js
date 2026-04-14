const companiesService = require('../services/companiesService');

const createCompany = async (req, res, next) => {
  try {
    const companyId = await companiesService.addCompany(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Company created successfully',
      data: { companyId },
    });
  } catch (error) {
    return next(error);
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const companies = await companiesService.getCompanies();
    return res.status(200).json({
      status: 'success',
      data: { companies },
    });
  } catch (error) {
    return next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  try {
    const company = await companiesService.getCompanyById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { company },
    });
  } catch (error) {
    return next(error);
  }
};

const updateCompany = async (req, res, next) => {
  try {
    await companiesService.editCompanyById(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Company updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    await companiesService.deleteCompanyById(req.params.id);
    return res.status(200).json({
      status: 'success',
      message: 'Company deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };
