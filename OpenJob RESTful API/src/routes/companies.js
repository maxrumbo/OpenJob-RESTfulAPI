const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const CompanyService = require('../services/CompanyService');
const CacheService = require('../services/CacheService');
const { companySchema } = require('../validators/companies');

const router = express.Router();

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Get all companies
 *     tags:
 *       - Companies
 *     responses:
 *       200:
 *         description: List of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   type: object
 *                   properties:
 *                     companies:
 *                       type: array
 *                       items:
 *                         type: object
 */
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

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Get company by ID
 *     tags:
 *       - Companies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Company ID
 *     responses:
 *       200:
 *         description: Company details
 *       404:
 *         description: Company not found
 */
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

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created successfully
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update company by ID
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
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

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete company by ID
 *     tags:
 *       - Companies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company not found
 */
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
