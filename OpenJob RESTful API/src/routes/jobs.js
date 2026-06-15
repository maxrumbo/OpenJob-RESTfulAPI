const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const BookmarkService = require('../services/BookmarkService');
const CacheService = require('../services/CacheService');
const JobService = require('../services/JobService');
const { jobSchema, updateJobSchema, jobSearchQuerySchema } = require('../validators/jobs');

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs (with optional filters)
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by job title
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: company
 *         schema:
 *           type: string
 *         description: Filter by company
 *     responses:
 *       200:
 *         description: List of jobs
 */
router.get(
  '/',
  validate(jobSearchQuerySchema, 'query'),
  asyncHandler(async (req, res) => {
    const jobs = await JobService.getJobs(req.query);

    res.json({
      status: 'success',
      data: {
        jobs,
      },
    });
  }),
);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job posting
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category_id
 *               - company_id
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category_id:
 *                 type: string
 *               company_id:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, closed]
 *     responses:
 *       201:
 *         description: Job created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  validate(jobSchema),
  asyncHandler(async (req, res) => {
    const jobId = await JobService.createJob(req.auth.id, req.body);

    res.status(201).json({
      status: 'success',
      message: 'Lowongan pekerjaan berhasil ditambahkan',
      data: {
        id: jobId,
      },
    });
  }),
);

/**
 * @swagger
 * /jobs/company/{companyId}:
 *   get:
 *     summary: Get jobs by company ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs for the company
 *       404:
 *         description: Company not found
 */
router.get(
  '/company/:companyId',
  asyncHandler(async (req, res) => {
    const jobs = await JobService.getJobsByCompany(req.params.companyId);

    res.json({
      status: 'success',
      data: {
        jobs,
      },
    });
  }),
);

/**
 * @swagger
 * /jobs/category/{categoryId}:
 *   get:
 *     summary: Get jobs by category ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of jobs in the category
 *       404:
 *         description: Category not found
 */
router.get(
  '/category/:categoryId',
  asyncHandler(async (req, res) => {
    const jobs = await JobService.getJobsByCategory(req.params.categoryId);

    res.json({
      status: 'success',
      data: {
        jobs,
      },
    });
  }),
);

/**
 * @swagger
 * /jobs/{jobId}/bookmark:
 *   post:
 *     summary: Add a job bookmark
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Bookmark added successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/:jobId/bookmark',
  authenticate,
  asyncHandler(async (req, res) => {
    const bookmarkId = await BookmarkService.createBookmark(req.auth.id, req.params.jobId);
    await CacheService.delete(`bookmarks:user:${req.auth.id}`);

    res.status(201).json({
      status: 'success',
      message: 'Bookmark berhasil ditambahkan',
      data: {
        id: bookmarkId,
      },
    });
  }),
);

/**
 * @swagger
 * /jobs/{jobId}/bookmark/{id}:
 *   get:
 *     summary: Get bookmark details
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark details
 *       404:
 *         description: Bookmark not found
 */
router.get(
  '/:jobId/bookmark/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    const bookmark = await BookmarkService.getBookmarkById(
      req.auth.id,
      req.params.jobId,
      req.params.id,
    );

    res.json({
      status: 'success',
      data: bookmark,
    });
  }),
);

/**
 * @swagger
 * /jobs/{jobId}/bookmark:
 *   delete:
 *     summary: Remove a job bookmark
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bookmark not found
 */
router.delete(
  '/:jobId/bookmark',
  authenticate,
  asyncHandler(async (req, res) => {
    await BookmarkService.deleteBookmarkByUserAndJob(req.auth.id, req.params.jobId);
    await CacheService.delete(`bookmarks:user:${req.auth.id}`);

    res.json({
      status: 'success',
      message: 'Bookmark berhasil dihapus',
    });
  }),
);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Get job details by ID
 *     tags:
 *       - Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job details
 *       404:
 *         description: Job not found
 */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const job = await JobService.getJobById(req.params.id);

    res.json({
      status: 'success',
      data: job,
    });
  }),
);

/**
 * @swagger
 * /jobs/{id}:
 *   put:
 *     summary: Update job posting by ID
 *     tags:
 *       - Jobs
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 */
router.put(
  '/:id',
  authenticate,
  validate(updateJobSchema),
  asyncHandler(async (req, res) => {
    await JobService.updateJobById(req.params.id, req.body);

    res.json({
      status: 'success',
      message: 'Lowongan pekerjaan berhasil diperbarui',
    });
  }),
);

/**
 * @swagger
 * /jobs/{id}:
 *   delete:
 *     summary: Delete job posting by ID
 *     tags:
 *       - Jobs
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
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    await JobService.deleteJobById(req.params.id);

    res.json({
      status: 'success',
      message: 'Lowongan pekerjaan berhasil dihapus',
    });
  }),
);

module.exports = router;
