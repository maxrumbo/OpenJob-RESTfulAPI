const pool = require('../config/database');
const { nanoid } = require('nanoid');
const InvariantError = require('../utils/InvariantError');
const NotFoundError = require('../utils/NotFoundError');

const addApplication = async ({ userId, job_id, cover_letter }) => {
  const id = `app-${nanoid(16)}`;

  const result = await pool.query(
    `INSERT INTO applications (id, user_id, job_id, cover_letter)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [id, userId, job_id, cover_letter || null],
  );

  if (!result.rows.length) {
    throw new InvariantError('Failed to create application');
  }

  return result.rows[0].id;
};

const getApplications = async () => {
  const result = await pool.query(
    `SELECT a.id, a.user_id, u.fullname AS user_name, a.job_id, j.title AS job_title,
            a.status, a.cover_letter, a.created_at, a.updated_at
     FROM applications a
     LEFT JOIN users u ON a.user_id = u.id
     LEFT JOIN jobs j ON a.job_id = j.id
     ORDER BY a.created_at DESC`,
  );
  return result.rows;
};

const getApplicationById = async (id) => {
  const result = await pool.query(
    `SELECT a.id, a.user_id, u.fullname AS user_name, a.job_id, j.title AS job_title,
            a.status, a.cover_letter, a.created_at, a.updated_at
     FROM applications a
     LEFT JOIN users u ON a.user_id = u.id
     LEFT JOIN jobs j ON a.job_id = j.id
     WHERE a.id = $1`,
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Application not found');
  }

  return result.rows[0];
};

const getApplicationsByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT a.id, a.user_id, u.fullname AS user_name, a.job_id, j.title AS job_title,
            a.status, a.cover_letter, a.created_at, a.updated_at
     FROM applications a
     LEFT JOIN users u ON a.user_id = u.id
     LEFT JOIN jobs j ON a.job_id = j.id
     WHERE a.user_id = $1
     ORDER BY a.created_at DESC`,
    [userId],
  );
  return result.rows;
};

const getApplicationsByJobId = async (jobId) => {
  const result = await pool.query(
    `SELECT a.id, a.user_id, u.fullname AS user_name, a.job_id, j.title AS job_title,
            a.status, a.cover_letter, a.created_at, a.updated_at
     FROM applications a
     LEFT JOIN users u ON a.user_id = u.id
     LEFT JOIN jobs j ON a.job_id = j.id
     WHERE a.job_id = $1
     ORDER BY a.created_at DESC`,
    [jobId],
  );
  return result.rows;
};

const editApplicationById = async (id, { status }) => {
  const result = await pool.query(
    `UPDATE applications SET status = $1, updated_at = NOW()
     WHERE id = $2 RETURNING id`,
    [status, id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Application not found');
  }

  return result.rows[0].id;
};

const deleteApplicationById = async (id) => {
  const result = await pool.query(
    'DELETE FROM applications WHERE id = $1 RETURNING id',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Application not found');
  }
};

module.exports = {
  addApplication, getApplications, getApplicationById,
  getApplicationsByUserId, getApplicationsByJobId,
  editApplicationById, deleteApplicationById,
};
