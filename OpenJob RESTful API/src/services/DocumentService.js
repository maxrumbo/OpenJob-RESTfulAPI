const fs = require('fs/promises');

const pool = require('../database/pool');
const AuthorizationError = require('../exceptions/AuthorizationError');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const generateId = require('../utils/id');

const mapDocument = (row) => ({
  id: row.id,
  userId: row.user_id,
  filename: row.filename,
  originalName: row.original_name,
  mimeType: row.mime_type,
  size: row.size,
  path: row.path,
  uploadedAt: row.uploaded_at,
});

const DocumentService = {
  async createDocument(userId, file) {
    if (!file) {
      throw new InvariantError("File is required");
    }

    const id = generateId('document');
    const result = await pool.query(
      `INSERT INTO documents (id, user_id, filename, original_name, mime_type, size, path)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, filename, original_name, size`,
      [id, userId, file.filename, file.originalname, file.mimetype, file.size, file.path],
    );

    return result.rows[0];
  },

  async getDocuments() {
    const result = await pool.query(
      `SELECT id, user_id, filename, original_name, mime_type, size, path, uploaded_at
       FROM documents
       ORDER BY uploaded_at DESC`,
    );

    return result.rows.map(mapDocument);
  },

  async getDocumentById(id) {
    const result = await pool.query(
      `SELECT id, user_id, filename, original_name, mime_type, size, path, uploaded_at
       FROM documents
       WHERE id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }

    return mapDocument(result.rows[0]);
  },

  async deleteDocumentById(userId, id) {
    const document = await this.getDocumentById(id);

    if (document.userId !== userId) {
      throw new AuthorizationError('Dokumen bukan milik user yang sedang login');
    }

    await pool.query('DELETE FROM documents WHERE id = $1', [id]);

    try {
      await fs.unlink(document.path);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  },
};

module.exports = DocumentService;
