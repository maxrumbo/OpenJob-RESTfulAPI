const pool = require('../config/database');
const { nanoid } = require('nanoid');
const InvariantError = require('../utils/InvariantError');
const NotFoundError = require('../utils/NotFoundError');

const addJob = async ({ company_id, category_id, title, description, location, type, salary_range }) => {
  const id = `job-${nanoid(16)}`;

  const result = await pool.query(
    `INSERT INTO jobs (id, company_id, category_id, title, description, location, type, salary_range)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [id, company_id, category_id || null, title, description || null, location || null, type || null, salary_range || null],
  );

  if (!result.rows.length) {
    throw new InvariantError('Failed to create job');
  }

  return result.rows[0].id;
};

const getJobs = async ({ title, companyName } = {}) => {
  let query = `
    SELECT j.id, j.title, j.description, j.location, j.type, j.salary_range,
           j.company_id, c.name AS company_name,
           j.category_id, cat.name AS category_name,
           j.created_at, j.updated_at
    FROM jobs j
    LEFT JOIN companies c ON j.company_id = c.id
    LEFT JOIN categories cat ON j.category_id = cat.id
  `;

  const conditions = [];
  const values = [];
  let paramIndex = 1;

  if (title) {
    conditions.push(`j.title ILIKE $${paramIndex}`);
    values.push(`%${title}%`);
    paramIndex++;
  }

  if (companyName) {
    conditions.push(`c.name ILIKE $${paramIndex}`);
    values.push(`%${companyName}%`);
    paramIndex++;
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ' ORDER BY j.created_at DESC';

  const result = await pool.query(query, values);
  return result.rows;
};

const getJobById = async (id) => {
  const result = await pool.query(
    `SELECT j.id, j.title, j.description, j.location, j.type, j.salary_range,
            j.company_id, c.name AS company_name,
            j.category_id, cat.name AS category_name,
            j.created_at, j.updated_at
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN categories cat ON j.category_id = cat.id
     WHERE j.id = $1`,
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Job not found');
  }

  return result.rows[0];
};

const getJobsByCompanyId = async (companyId) => {
  const result = await pool.query(
    `SELECT j.id, j.title, j.description, j.location, j.type, j.salary_range,
            j.company_id, c.name AS company_name,
            j.category_id, cat.name AS category_name,
            j.created_at, j.updated_at
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN categories cat ON j.category_id = cat.id
     WHERE j.company_id = $1
     ORDER BY j.created_at DESC`,
    [companyId],
  );
  return result.rows;
};

const getJobsByCategoryId = async (categoryId) => {
  const result = await pool.query(
    `SELECT j.id, j.title, j.description, j.location, j.type, j.salary_range,
            j.company_id, c.name AS company_name,
            j.category_id, cat.name AS category_name,
            j.created_at, j.updated_at
     FROM jobs j
     LEFT JOIN companies c ON j.company_id = c.id
     LEFT JOIN categories cat ON j.category_id = cat.id
     WHERE j.category_id = $1
     ORDER BY j.created_at DESC`,
    [categoryId],
  );
  return result.rows;
};

const editJobById = async (id, { company_id, category_id, title, description, location, type, salary_range }) => {
  const result = await pool.query(
    `UPDATE jobs SET company_id = $1, category_id = $2, title = $3, description = $4,
     location = $5, type = $6, salary_range = $7, updated_at = NOW()
     WHERE id = $8 RETURNING id`,
    [company_id, category_id || null, title, description || null, location || null, type || null, salary_range || null, id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Job not found');
  }

  return result.rows[0].id;
};

const deleteJobById = async (id) => {
  const result = await pool.query(
    'DELETE FROM jobs WHERE id = $1 RETURNING id',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Job not found');
  }
};

module.exports = {
  addJob, getJobs, getJobById, getJobsByCompanyId,
  getJobsByCategoryId, editJobById, deleteJobById,
};
