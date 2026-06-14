const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const CompanyService = require('../services/CompanyService');
const CacheService = require('../services/CacheService');
const { companySchema } = require('../validators/companies');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const companies = await CompanyService.getCompanies();

    res.json({
      status: 'success',
      data: {
        companies,
      },
    });
  }),
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    try {
      const company = await CacheService.get(`company:${req.params.id}`);
      res.setHeader('X-Data-Source', 'cache');
      return res.json({
        status: 'success',
        data: JSON.parse(company),
      });
    } catch (error) {
      const company = await CompanyService.getCompanyById(req.params.id);
      await CacheService.set(`company:${req.params.id}`, JSON.stringify(company));

      res.setHeader('X-Data-Source', 'database');
      res.json({
        status: 'success',
        data: company,
      });
    }
  }),
);

router.post(
  '/',
  authenticate,
  validate(companySchema),
  asyncHandler(async (req, res) => {
    const companyId = await CompanyService.createCompany(req.auth.id, req.body);
    await CacheService.delete(`company:${companyId}`);

    res.status(201).json({
      status: 'success',
      message: 'Perusahaan berhasil ditambahkan',
      data: {
        id: companyId,
      },
    });
  }),
);

router.put(
  '/:id',
  authenticate,
  validate(companySchema),
  asyncHandler(async (req, res) => {
    await CompanyService.updateCompanyById(req.params.id, req.body);
    await CacheService.delete(`company:${req.params.id}`);

    res.json({
      status: 'success',
      message: 'Perusahaan berhasil diperbarui',
    });
  }),
);

router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    await CompanyService.deleteCompanyById(req.params.id);
    await CacheService.delete(`company:${req.params.id}`);

    res.json({
      status: 'success',
      message: 'Perusahaan berhasil dihapus',
    });
  }),
);

module.exports = router;
