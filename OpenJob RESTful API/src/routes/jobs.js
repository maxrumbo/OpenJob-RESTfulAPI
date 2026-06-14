const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const BookmarkService = require('../services/BookmarkService');
const CacheService = require('../services/CacheService');
const JobService = require('../services/JobService');
const { jobSchema, updateJobSchema, jobSearchQuerySchema } = require('../validators/jobs');

const router = express.Router();

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
