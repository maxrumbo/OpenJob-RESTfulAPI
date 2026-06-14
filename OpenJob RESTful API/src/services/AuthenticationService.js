const pool = require('../database/pool');
const InvariantError = require('../exceptions/InvariantError');

const AuthenticationService = {
  async addRefreshToken(token) {
    await pool.query('INSERT INTO authentications (token) VALUES ($1)', [token]);
  },

  async verifyRefreshToken(token) {
    const result = await pool.query('SELECT token FROM authentications WHERE token = $1', [token]);

    if (result.rowCount === 0) {
      throw new InvariantError('Refresh token tidak ditemukan di database');
    }
  },

  async deleteRefreshToken(token) {
    await pool.query('DELETE FROM authentications WHERE token = $1', [token]);
  },
};

module.exports = AuthenticationService;
