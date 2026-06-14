const pool = require('../database/pool');
const AuthorizationError = require('../exceptions/AuthorizationError');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const generateId = require('../utils/id');

const normalizeApplicationPayload = (payload) => ({
  jobId: payload.jobId || payload.job_id,
  documentId: payload.documentId || payload.document_id || null,
  coverLetter: payload.coverLetter || payload.cover_letter || null,
});

const mapApplication = (row) => ({
  id: row.id,
  user_id: row.user_id,
  job_id: row.job_id,
  document_id: row.document_id,
  cover_letter: row.cover_letter,
  applied_at: row.applied_at,
  updated_at: row.updated_at,
  status: row.status,
  appliedAt: row.applied_at,
  updatedAt: row.updated_at,
  user: {
    id: row.user_id,
    name: row.user_name,
    email: row.user_email,
  },
  job: {
    id: row.job_id,
    title: row.job_title,
    company: {
      id: row.company_id,
      name: row.company_name,
    },
  },
  document: row.document_id
    ? {
        id: row.document_id,
        originalName: row.original_name,
      }
    : null,
});

const baseApplicationQuery = `
  SELECT a.id,
         a.user_id,
         u.name AS user_name,
         u.email AS user_email,
         a.job_id,
         j.title AS job_title,
         c.id AS company_id,
         c.name AS company_name,
         a.document_id,
         d.original_name,
         a.cover_letter,
         a.status,
         a.applied_at,
         a.updated_at
  FROM applications a
  JOIN users u ON u.id = a.user_id
  JOIN jobs j ON j.id = a.job_id
  JOIN companies c ON c.id = j.company_id
  LEFT JOIN documents d ON d.id = a.document_id
`;

const ApplicationService = {
  async createApplication(userId, payload) {
    const application = normalizeApplicationPayload(payload);
    const id = generateId('application');

    if (application.documentId) {
      const document = await pool.query('SELECT user_id FROM documents WHERE id = $1', [application.documentId]);

      if (document.rowCount === 0) {
        throw new NotFoundError('Dokumen tidak ditemukan');
      }

      if (document.rows[0].user_id !== userId) {
        throw new AuthorizationError('Dokumen bukan milik user yang sedang login');
      }
    }

    try {
      const result = await pool.query(
        `INSERT INTO applications (id, user_id, job_id, document_id, cover_letter)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [id, userId, application.jobId, application.documentId, application.coverLetter],
      );

      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23503') {
        throw new InvariantError('Lowongan pekerjaan atau dokumen tidak ditemukan');
      }

      if (error.code === '23505') {
        const duplicate = await pool.query(
          'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
          [userId, application.jobId],
        );

        if (duplicate.rowCount > 0) {
          throw new InvariantError('Gagal menambahkan lamaran, Anda sudah melamar pekerjaan ini');
        }
      }

      throw error;
    }
  },

  async getApplications() {
    const result = await pool.query(
      `${baseApplicationQuery}
       ORDER BY a.applied_at DESC`,
    );

    return result.rows.map(mapApplication);
  },

  async getApplicationById(id) {
    const result = await pool.query(
      `${baseApplicationQuery}
       WHERE a.id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Lamaran pekerjaan tidak ditemukan');
    }

    return mapApplication(result.rows[0]);
  },

  async getApplicationsByUser(userId) {
    const result = await pool.query(
      `${baseApplicationQuery}
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`,
      [userId],
    );

    return result.rows.map(mapApplication);
  },

  async getApplicationsByJob(jobId) {
    const result = await pool.query(
      `${baseApplicationQuery}
       WHERE a.job_id = $1
       ORDER BY a.applied_at DESC`,
      [jobId],
    );

    return result.rows.map(mapApplication);
  },

  async updateApplicationStatus(id, status) {
    const result = await pool.query(
      `UPDATE applications
       SET status = $1,
           updated_at = current_timestamp
       WHERE id = $2
       RETURNING id`,
      [status, id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Lamaran pekerjaan tidak ditemukan');
    }
  },

  async deleteApplicationById(userId, id) {
    const result = await pool.query(
      `DELETE FROM applications
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, userId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Lamaran pekerjaan tidak ditemukan');
    }
  },
};

module.exports = ApplicationService;
