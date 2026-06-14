const pool = require('../database/pool');
const AuthorizationError = require('../exceptions/AuthorizationError');
const NotFoundError = require('../exceptions/NotFoundError');
const generateId = require('../utils/id');

const mapBookmark = (row) => ({
  id: row.id,
  user_id: row.user_id,
  job_id: row.job_id,
  created_at: row.created_at,
  job_title: row.job_title,
  company_id: row.company_id,
  company_name: row.company_name,
  category_id: row.category_id,
  category_name: row.category_name,
  job_description: row.job_description,
  job_type: row.employment_type,
  experience_level: row.experience_level,
  location_type: row.location_type,
  location_city: row.location,
  salary_min: row.salary_min,
  salary_max: row.salary_max,
  is_salary_visible: row.is_salary_visible,
  status: row.job_status,
});

const baseBookmarkQuery = `
  SELECT b.id,
         b.user_id,
         b.job_id,
         b.created_at,
         j.title AS job_title,
         c.id AS company_id,
         c.name AS company_name,
         cat.id AS category_id,
         cat.name AS category_name,
         j.description AS job_description,
         j.employment_type,
         j.experience_level,
         j.location_type,
         j.location,
         j.salary_min,
         j.salary_max,
         j.is_salary_visible,
         j.status AS job_status
  FROM bookmarks b
  JOIN jobs j ON j.id = b.job_id
  JOIN companies c ON c.id = j.company_id
  JOIN categories cat ON cat.id = j.category_id
`;

const BookmarkService = {
  async createBookmark(userId, jobId) {
    const id = generateId('bookmark');

    try {
      const result = await pool.query(
        `INSERT INTO bookmarks (id, user_id, job_id)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [id, userId, jobId],
      );

      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23503') {
        throw new NotFoundError('Lowongan pekerjaan tidak ditemukan');
      }

      if (error.code === '23505') {
        const duplicate = await pool.query(
          'SELECT id FROM bookmarks WHERE user_id = $1 AND job_id = $2',
          [userId, jobId],
        );

        if (duplicate.rowCount > 0) {
          return duplicate.rows[0].id;
        }
      }

      throw error;
    }
  },

  async getBookmarkById(userId, jobId, id) {
    const result = await pool.query(
      `${baseBookmarkQuery}
       WHERE b.id = $1 AND b.job_id = $2`,
      [id, jobId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }

    if (result.rows[0].user_id !== userId) {
      throw new AuthorizationError('Bookmark bukan milik user yang sedang login');
    }

    return mapBookmark(result.rows[0]);
  },

  async getBookmarksByUser(userId) {
    const result = await pool.query(
      `${baseBookmarkQuery}
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId],
    );

    return result.rows.map(mapBookmark);
  },

  async deleteBookmarkByUserAndJob(userId, jobId) {
    const result = await pool.query(
      `DELETE FROM bookmarks
       WHERE user_id = $1 AND job_id = $2
       RETURNING id`,
      [userId, jobId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
  },

  async deleteBookmark(userId, id) {
    const result = await pool.query(
      `DELETE FROM bookmarks
       WHERE user_id = $1 AND id = $2
       RETURNING id`,
      [userId, id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }
  },
};

module.exports = BookmarkService;
