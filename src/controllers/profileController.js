const usersService = require('../services/usersService');
const applicationsService = require('../services/applicationsService');
const bookmarksService = require('../services/bookmarksService');

const getProfile = async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.userId);
    return res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};

const getMyApplications = async (req, res, next) => {
  try {
    const applications = await applicationsService.getApplicationsByUserId(req.userId);
    return res.status(200).json({
      status: 'success',
      data: { applications },
    });
  } catch (error) {
    return next(error);
  }
};

const getMyBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await bookmarksService.getBookmarksByUserId(req.userId);
    return res.status(200).json({
      status: 'success',
      data: { bookmarks },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getProfile, getMyApplications, getMyBookmarks };
