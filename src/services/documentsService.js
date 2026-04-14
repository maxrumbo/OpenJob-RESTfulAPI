const pool = require('../config/database');
const { nanoid } = require('nanoid');
const InvariantError = require('../utils/InvariantError');
const NotFoundError = require('../utils/NotFoundError');

const addDocument = async ({ userId, name, file_url, mime_type, size }) => {
  const id = `doc-${nanoid(16)}`;

  const result = await pool.query(
    `INSERT INTO documents (id, user_id, name, file_url, mime_type, size)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [id, userId, name, file_url, mime_type || null, size || null],
  );

  if (!result.rows.length) {
    throw new InvariantError('Failed to upload document');
  }

  return result.rows[0].id;
};

const getDocuments = async () => {
  const result = await pool.query(
    `SELECT d.id, d.user_id, u.fullname AS user_name, d.name, d.file_url, d.mime_type, d.size, d.created_at
     FROM documents d
     LEFT JOIN users u ON d.user_id = u.id
     ORDER BY d.created_at DESC`,
  );
  return result.rows;
};

const getDocumentById = async (id) => {
  const result = await pool.query(
    `SELECT d.id, d.user_id, u.fullname AS user_name, d.name, d.file_url, d.mime_type, d.size, d.created_at
     FROM documents d
     LEFT JOIN users u ON d.user_id = u.id
     WHERE d.id = $1`,
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Document not found');
  }

  return result.rows[0];
};

const deleteDocumentById = async (id) => {
  const result = await pool.query(
    'DELETE FROM documents WHERE id = $1 RETURNING id, file_url',
    [id],
  );

  if (!result.rows.length) {
    throw new NotFoundError('Document not found');
  }

  return result.rows[0];
};

module.exports = { addDocument, getDocuments, getDocumentById, deleteDocumentById };
