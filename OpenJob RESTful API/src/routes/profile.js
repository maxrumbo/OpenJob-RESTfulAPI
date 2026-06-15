const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const ApplicationService = require('../services/ApplicationService');
const BookmarkService = require('../services/BookmarkService');
const UserService = require('../services/UserService');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /profile/applications:
 *   get:
 *     summary: Get current user applications
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user applications with details
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /profile/bookmarks:
 *   get:
 *     summary: Get current user bookmarks
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookmarked jobs
 *       401:
 *         description: Unauthorized
 */
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
