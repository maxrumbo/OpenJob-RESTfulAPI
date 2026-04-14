const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const validate = require('../middlewares/validationMiddleware');
const { UserRegisterPayloadSchema } = require('../validators/users');

// PUBLIC
router.post('/', validate(UserRegisterPayloadSchema), usersController.registerUser);
router.get('/:id', usersController.getUserById);

module.exports = router;
