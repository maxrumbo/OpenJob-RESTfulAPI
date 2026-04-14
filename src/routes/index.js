const express = require('express');
const router = express.Router();

const usersRoutes = require('./users');
const companiesRoutes = require('./companies');
const categoriesRoutes = require('./categories');
const jobsRoutes = require('./jobs');
const applicationsRoutes = require('./applications');
const bookmarksRoutes = require('./bookmarks');
const documentsRoutes = require('./documents');
const authenticationsRoutes = require('./authentications');
const profileRoutes = require('./profile');

router.use('/users', usersRoutes);
router.use('/companies', companiesRoutes);
router.use('/categories', categoriesRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationsRoutes);
router.use('/bookmarks', bookmarksRoutes);
router.use('/documents', documentsRoutes);
router.use('/authentications', authenticationsRoutes);
router.use('/profile', profileRoutes);

module.exports = router;
