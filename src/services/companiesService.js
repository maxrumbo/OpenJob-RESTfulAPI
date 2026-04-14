const pool = require('../config/database');
const { nanoid } = require('nanoid');
const InvariantError = require('../utils/InvariantError');
const NotFoundError = require('../utils/NotFoundError');

const addCompany = async ({ name, description, location, logo_url }) => {
  const id = `company-${nanoid(16)}`;

  const result = await pool.query(
    `INSERT INTO companies (id, name, description, location, logo_url)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [id, name, description || null, location || null, logo_url || null],
  );

  if (!result.rows.length) {
    throw new InvariantError('Failed to create company');
  }

  return result.rows[0].id;
};

const getCompanies = async () => {
  const result = await pool.query(
    'SELECT id, name, description, location, logo_url, created_at, updated_at FROM companies ORDER BY created_at DESC',
  );
  return result.rows;
};

const getCompanyById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, description, location, logo_url, created_at, updated_at FROM companies WHERE id = $1',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Company not found');
  }

  return result.rows[0];
};

const editCompanyById = async (id, { name, description, location, logo_url }) => {
  const result = await pool.query(
    `UPDATE companies SET name = $1, description = $2, location = $3, logo_url = $4, updated_at = NOW()
     WHERE id = $5 RETURNING id`,
    [name, description || null, location || null, logo_url || null, id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Company not found');
  }

  return result.rows[0].id;
};

const deleteCompanyById = async (id) => {
  const result = await pool.query(
    'DELETE FROM companies WHERE id = $1 RETURNING id',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Company not found');
  }
};

module.exports = { addCompany, getCompanies, getCompanyById, editCompanyById, deleteCompanyById };
