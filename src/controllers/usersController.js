const usersService = require('../services/usersService');

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, fullname } = req.body;
    const userId = await usersService.addUser({ username, email, password, fullname });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { userId },
    });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await usersService.getUserById(id);

    return res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { registerUser, getUserById };
