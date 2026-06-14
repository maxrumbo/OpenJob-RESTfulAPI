const bcrypt = require('bcryptjs');

const pool = require('../database/pool');
const AuthenticationError = require('../exceptions/AuthenticationError');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const generateId = require('../utils/id');

const GENERATED_EMAIL_DOMAIN = 'openjob.local';

const getGeneratedEmail = (username) => `${username.toLowerCase()}@${GENERATED_EMAIL_DOMAIN}`;

const getUsernameFromEmail = (email) => {
  if (!email) {
    return undefined;
  }

  return email.split('@')[0];
};

const normalizeUserPayload = (payload) => {
  const username = payload.username || getUsernameFromEmail(payload.email);

  return {
    name: payload.name || payload.fullname,
    email: payload.email || getGeneratedEmail(username),
    password: payload.password,
    role: payload.role || 'user',
  };
};

const mapUser = (row) => ({
  id: row.id,
  username: getUsernameFromEmail(row.email),
  fullname: row.name,
  name: row.name,
  email: row.email,
  role: row.role,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const UserService = {
  async createUser(payload) {
    const user = normalizeUserPayload(payload);
    const id = generateId('user');
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const result = await pool.query(
      `INSERT INTO users (id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE
       SET name = EXCLUDED.name,
           password = EXCLUDED.password,
           role = EXCLUDED.role,
           updated_at = current_timestamp
       RETURNING id`,
      [id, user.name, user.email, hashedPassword, user.role],
    );

    return result.rows[0].id;
  },

  async getUserById(id) {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at, updated_at
       FROM users
       WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return mapUser(result.rows[0]);
  },

  async updateUserById(id, payload) {
    const fields = [];
    const values = [];

    if (payload.name !== undefined || payload.fullname !== undefined) {
      values.push(payload.name || payload.fullname);
      fields.push(`name = $${values.length}`);
    }

    if (payload.email !== undefined || payload.username !== undefined) {
      values.push(payload.email || getGeneratedEmail(payload.username));
      fields.push(`email = $${values.length}`);
    }

    if (payload.password !== undefined) {
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      values.push(hashedPassword);
      fields.push(`password = $${values.length}`);
    }

    if (payload.role !== undefined) {
      values.push(payload.role);
      fields.push(`role = $${values.length}`);
    }

    values.push(id);

    let result;

    try {
      result = await pool.query(
        `UPDATE users
         SET ${fields.join(', ')},
             updated_at = current_timestamp
         WHERE id = $${values.length}
         RETURNING id`,
        values,
      );
    } catch (error) {
      if (error.code === '23505') {
        throw new InvariantError('Email sudah digunakan');
      }

      throw error;
    }

    if (result.rowCount === 0) {
      throw new NotFoundError('User tidak ditemukan');
    }
  },

  async verifyUserCredential(emailOrUsername, password) {
    const email = emailOrUsername.includes('@')
      ? emailOrUsername
      : getGeneratedEmail(emailOrUsername);

    const result = await pool.query(
      `SELECT id, name, email, password, role, created_at, updated_at
       FROM users
       WHERE email = $1`,
      [email],
    );

    if (result.rowCount === 0) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const user = result.rows[0];
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    return mapUser(user);
  },
};

module.exports = UserService;
