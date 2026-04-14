const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');
const bookmarksController = require('../controllers/bookmarksController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { JobPayloadSchema } = require('../validators/jobs');

// PUBLIC
router.get('/', jobsController.getJobs);
router.get('/:id', jobsController.getJobById);
router.get('/company/:companyId', jobsController.getJobsByCompanyId);
router.get('/category/:categoryId', jobsController.getJobsByCategoryId);

// PROTECTED - Jobs
router.post('/', authMiddleware, validate(JobPayloadSchema), jobsController.createJob);
router.put('/:id', authMiddleware, validate(JobPayloadSchema), jobsController.updateJob);
router.delete('/:id', authMiddleware, jobsController.deleteJob);

// PROTECTED - Bookmarks (nested under /jobs/:jobId/bookmark)
router.post('/:jobId/bookmark', authMiddleware, bookmarksController.createBookmark);
router.get('/:jobId/bookmark/:id', authMiddleware, bookmarksController.getBookmarkById);
router.delete('/:jobId/bookmark', authMiddleware, bookmarksController.deleteBookmark);

module.exports = router;
