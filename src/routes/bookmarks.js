const express = require('express');
const router = express.Router();
const bookmarksController = require('../controllers/bookmarksController');
const authMiddleware = require('../middlewares/authMiddleware');

// ALL PROTECTED
router.use(authMiddleware);

router.get('/', bookmarksController.getBookmarksByUser);

module.exports = router;
