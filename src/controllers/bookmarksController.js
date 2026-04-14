const bookmarksService = require('../services/bookmarksService');

const createBookmark = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { jobId } = req.params;
    const bookmarkId = await bookmarksService.addBookmark({ userId, jobId });
    return res.status(201).json({
      status: 'success',
      message: 'Job bookmarked successfully',
      data: { bookmarkId },
    });
  } catch (error) {
    return next(error);
  }
};

const getBookmarkById = async (req, res, next) => {
  try {
    const bookmark = await bookmarksService.getBookmarkById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: { bookmark },
    });
  } catch (error) {
    return next(error);
  }
};

const getBookmarksByUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const bookmarks = await bookmarksService.getBookmarksByUserId(userId);
    return res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  } catch (error) {
    return next(error);
  }
};

const deleteBookmark = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { jobId } = req.params;
    await bookmarksService.deleteBookmarkByUserAndJob(userId, jobId);
    return res.status(200).json({
      status: 'success',
      message: 'Bookmark deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createBookmark, getBookmarkById, getBookmarksByUser, deleteBookmark };
