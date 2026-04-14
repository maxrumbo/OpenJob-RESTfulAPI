const express = require('express');
const router = express.Router();
const authenticationsController = require('../controllers/authenticationsController');
const authMiddleware = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validationMiddleware');
const { LoginPayloadSchema, RefreshTokenPayloadSchema, DeleteAuthPayloadSchema } = require('../validators/authentications');

// PUBLIC
router.post('/', validate(LoginPayloadSchema), authenticationsController.login);
router.put('/', validate(RefreshTokenPayloadSchema), authenticationsController.refreshAccessToken);

// PROTECTED
router.delete('/', authMiddleware, validate(DeleteAuthPayloadSchema), authenticationsController.logout);

module.exports = router;
