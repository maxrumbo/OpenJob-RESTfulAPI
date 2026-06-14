const express = require('express');

const asyncHandler = require('../middlewares/asyncHandler');
const authenticate = require('../middlewares/authenticate');
const BookmarkService = require('../services/BookmarkService');
const CacheService = require('../services/CacheService');

const router = express.Router();

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
