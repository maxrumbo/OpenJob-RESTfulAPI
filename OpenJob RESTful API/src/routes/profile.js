const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const ApplicationService = require('../services/ApplicationService');
const BookmarkService = require('../services/BookmarkService');
const UserService = require('../services/UserService');

const router = express.Router();

router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const user = await UserService.getUserById(req.auth.id);

    res.json({
      status: 'success',
      data: user,
    });
  }),
);

router.get(
  '/applications',
  asyncHandler(async (req, res) => {
    const applications = await ApplicationService.getApplicationsByUser(req.auth.id);

    res.json({
      status: 'success',
      data: {
        applications: applications.map((application) => ({
          ...application,
          user_name: application.user.name,
          job_title: application.job.title,
        })),
      },
    });
  }),
);

router.get(
  '/bookmarks',
  asyncHandler(async (req, res) => {
    const bookmarks = await BookmarkService.getBookmarksByUser(req.auth.id);

    res.json({
      status: 'success',
      data: {
        bookmarks,
      },
    });
  }),
);

module.exports = router;
