const pool = require('../config/database');
const { nanoid } = require('nanoid');
const InvariantError = require('../utils/InvariantError');

const addRefreshToken = async (token) => {
  const id = `auth-${nanoid(16)}`;
  await pool.query(
    'INSERT INTO authentications (id, token) VALUES ($1, $2)',
    [id, token],
  );
};

const verifyRefreshToken = async (token) => {
  const result = await pool.query(
    'SELECT token FROM authentications WHERE token = $1',
    [token],
  );

  if (!result.rows.length) {
    throw new InvariantError('Invalid refresh token');
  }
};

const deleteRefreshToken = async (token) => {
  const result = await pool.query(
    'DELETE FROM authentications WHERE token = $1 RETURNING id',
    [token],
  );

  if (!result.rows.length) {
    throw new InvariantError('Invalid refresh token');
  }
};

module.exports = { addRefreshToken, verifyRefreshToken, deleteRefreshToken };
