const pool = require('../config/database');
const { nanoid } = require('nanoid');
const InvariantError = require('../utils/InvariantError');
const NotFoundError = require('../utils/NotFoundError');

const addBookmark = async ({ userId, jobId }) => {
  // Check if bookmark already exists
  const check = await pool.query(
    'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
    [userId, jobId],
  );

  if (check.rows.length > 0) {
    throw new InvariantError('Job already bookmarked');
  }

  const id = `bookmark-${nanoid(16)}`;

  const result = await pool.query(
    `INSERT INTO bookmarks (id, user_id, job_id)
     VALUES ($1, $2, $3) RETURNING id`,
    [id, userId, jobId],
  );

  if (!result.rows.length) {
    throw new InvariantError('Failed to create bookmark');
  }

  return result.rows[0].id;
};

const getBookmarkById = async (id) => {
  const result = await pool.query(
    `SELECT b.id, b.user_id, b.job_id, j.title AS job_title,
            c.name AS company_name, b.created_at
     FROM bookmarks b
     LEFT JOIN jobs j ON b.job_id = j.id
     LEFT JOIN companies c ON j.company_id = c.id
     WHERE b.id = $1`,
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Bookmark not found');
  }

  return result.rows[0];
};

const getBookmarksByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT b.id, b.user_id, b.job_id, j.title AS job_title,
            c.name AS company_name, b.created_at
     FROM bookmarks b
     LEFT JOIN jobs j ON b.job_id = j.id
     LEFT JOIN companies c ON j.company_id = c.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId],
  );
  return result.rows;
};

const deleteBookmarkByUserAndJob = async (userId, jobId) => {
  const result = await pool.query(
    'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
    [userId, jobId],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Bookmark not found');
  }
};

module.exports = { addBookmark, getBookmarkById, getBookmarksByUserId, deleteBookmarkByUserAndJob };
