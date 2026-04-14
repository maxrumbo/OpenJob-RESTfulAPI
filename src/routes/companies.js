const express = require('express');
const router = express.Router();
const companiesController = require('../controllers/companiesController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { CompanyPayloadSchema } = require('../validators/companies');

// PUBLIC
router.get('/', companiesController.getCompanies);
router.get('/:id', companiesController.getCompanyById);

// PROTECTED
router.post('/', authMiddleware, validate(CompanyPayloadSchema), companiesController.createCompany);
router.put('/:id', authMiddleware, validate(CompanyPayloadSchema), companiesController.updateCompany);
router.delete('/:id', authMiddleware, companiesController.deleteCompany);

module.exports = router;
