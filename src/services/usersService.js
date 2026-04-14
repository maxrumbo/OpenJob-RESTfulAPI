const pool = require('../config/database');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../utils/InvariantError');
const NotFoundError = require('../utils/NotFoundError');
const AuthenticationError = require('../utils/AuthenticationError');

const addUser = async ({ username, email, password, fullname }) => {
  // Check if username already exists
  const checkUsername = await pool.query(
    'SELECT id FROM users WHERE username = $1',
    [username],
  );
  if (checkUsername.rows.length > 0) {
    throw new InvariantError('Username already exists');
  }

  // Check if email already exists
  const checkEmail = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email],
  );
  if (checkEmail.rows.length > 0) {
    throw new InvariantError('Email already exists');
  }

  const id = `user-${nanoid(16)}`;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (id, username, email, password, fullname)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [id, username, email, hashedPassword, fullname],
  );

  if (!result.rows.length) {
    throw new InvariantError('Failed to register user');
  }

  return result.rows[0].id;
};

const getUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, username, email, fullname, created_at, updated_at FROM users WHERE id = $1',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('User not found');
  }

  return result.rows[0];
};

const verifyUserCredential = async (username, password) => {
  const result = await pool.query(
    'SELECT id, password FROM users WHERE username = $1',
    [username],
  );

  if (!result.rows.length) {
    throw new AuthenticationError('Invalid credentials');
  }

  const { id, password: hashedPassword } = result.rows[0];
  const match = await bcrypt.compare(password, hashedPassword);

  if (!match) {
    throw new AuthenticationError('Invalid credentials');
  }

  return id;
};

module.exports = { addUser, getUserById, verifyUserCredential };
