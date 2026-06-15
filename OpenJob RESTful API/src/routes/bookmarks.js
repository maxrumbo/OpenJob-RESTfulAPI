const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const BookmarkService = require('../services/BookmarkService');
const CacheService = require('../services/CacheService');

const router = express.Router();

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Get user bookmarks
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookmarks
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    try {
      const bookmarks = await CacheService.get(`bookmarks:user:${req.auth.id}`);
      res.setHeader('X-Data-Source', 'cache');
      return res.json({
        status: 'success',
        data: {
          bookmarks: JSON.parse(bookmarks),
        },
      });
    } catch (error) {
      const bookmarks = await BookmarkService.getBookmarksByUser(req.auth.id);
      await CacheService.set(`bookmarks:user:${req.auth.id}`, JSON.stringify(bookmarks));

      res.setHeader('X-Data-Source', 'database');
      res.json({
        status: 'success',
        data: {
          bookmarks,
        },
      });
    }
  }),
);

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: Add a job bookmark
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bookmark added successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    // Assuming there is a create bookmark method
    await BookmarkService.createBookmark(req.auth.id, req.body.jobId);
    await CacheService.delete(`bookmarks:user:${req.auth.id}`);

    res.status(201).json({
      status: 'success',
      message: 'Bookmark berhasil ditambahkan',
    });
  }),
);

/**
 * @swagger
 * /bookmarks/{id}:
 *   delete:
 *     summary: Remove a bookmark
 *     tags:
 *       - Bookmarks
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmark ID
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bookmark not found
 */
router.delete(
  '/:id',
  authenticate,
  asyncHandler(async (req, res) => {
    await BookmarkService.deleteBookmark(req.auth.id, req.params.id);
    await CacheService.delete(`bookmarks:user:${req.auth.id}`);

    res.json({
      status: 'success',
      message: 'Bookmark berhasil dihapus',
    });
  }),
);

module.exports = router;
