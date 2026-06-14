const pool = require('../database/pool');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const generateId = require('../utils/id');

const normalizeJobPayload = (payload) => ({
  companyId: payload.companyId || payload.company_id,
  categoryId: payload.categoryId || payload.category_id,
  title: payload.title,
  description: payload.description,
  requirement: payload.requirement || null,
  location: payload.location || payload.location_city || null,
  employmentType: payload.employmentType || payload.employment_type || payload.job_type || 'full-time',
  experienceLevel: payload.experienceLevel || payload.experience_level || null,
  locationType: payload.locationType || payload.location_type || null,
  salaryMin: payload.salaryMin ?? payload.salary_min ?? null,
  salaryMax: payload.salaryMax ?? payload.salary_max ?? null,
  isSalaryVisible: payload.isSalaryVisible ?? payload.is_salary_visible ?? true,
  status: payload.status || 'open',
});

const getPayloadValue = (payload, keys) => {
  const key = keys.find((item) => Object.prototype.hasOwnProperty.call(payload, item));
  return key ? payload[key] : undefined;
};

const mapJob = (row) => ({
  id: row.id,
  company_id: row.company_id,
  category_id: row.category_id,
  company_name: row.company_name,
  title: row.title,
  description: row.description,
  job_type: row.employment_type,
  experience_level: row.experience_level,
  location_type: row.location_type,
  location_city: row.location,
  salary_min: row.salary_min,
  salary_max: row.salary_max,
  status: row.status,
});

const baseJobQuery = `
  SELECT j.id,
         j.company_id,
         c.name AS company_name,
         j.category_id,
         cat.name AS category_name,
         j.created_by,
         j.title,
         j.description,
         j.requirement,
         j.location,
         j.employment_type,
         j.experience_level,
         j.location_type,
         j.is_salary_visible,
         j.salary_min,
         j.salary_max,
         j.status,
         j.created_at,
         j.updated_at
  FROM jobs j
  JOIN companies c ON c.id = j.company_id
  JOIN categories cat ON cat.id = j.category_id
`;

const JobService = {
  async createJob(userId, payload) {
    const id = generateId('job');
    const job = normalizeJobPayload(payload);

    try {
      const result = await pool.query(
        `INSERT INTO jobs (
           id, company_id, category_id, created_by, title, description, requirement,
           location, employment_type, experience_level, location_type, salary_min,
           salary_max, is_salary_visible, status
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING id`,
        [
          id,
          job.companyId,
          job.categoryId,
          userId,
          job.title,
          job.description,
          job.requirement,
          job.location,
          job.employmentType,
          job.experienceLevel,
          job.locationType,
          job.salaryMin,
          job.salaryMax,
          job.isSalaryVisible,
          job.status,
        ],
      );

      return result.rows[0].id;
    } catch (error) {
      if (error.code === '23503') {
        throw new InvariantError('Perusahaan atau kategori tidak ditemukan');
      }
      throw error;
    }
  },

  async getJobs(query = {}) {
    const values = [];
    const conditions = [];

    if (query.title) {
      values.push(`%${query.title}%`);
      conditions.push(`j.title ILIKE $${values.length}`);
    }

    if (query['company-name']) {
      values.push(`%${query['company-name']}%`);
      conditions.push(`c.name ILIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `${baseJobQuery}
       ${whereClause}
       ORDER BY j.created_at DESC`,
      values,
    );

    return result.rows.map(mapJob);
  },

  async getJobById(id) {
    const result = await pool.query(
      `${baseJobQuery}
       WHERE j.id = $1`,
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundError('Lowongan pekerjaan tidak ditemukan');
    }

    return mapJob(result.rows[0]);
  },

  async getJobsByCompany(companyId) {
    const result = await pool.query(
      `${baseJobQuery}
       WHERE j.company_id = $1
       ORDER BY j.created_at DESC`,
      [companyId],
    );

    return result.rows.map(mapJob);
  },

  async getJobsByCategory(categoryId) {
    const result = await pool.query(
      `${baseJobQuery}
       WHERE j.category_id = $1
       ORDER BY j.created_at DESC`,
      [categoryId],
    );

    return result.rows.map(mapJob);
  },

  async updateJobById(id, payload) {
    const fieldMappings = [
      { column: 'company_id', keys: ['companyId', 'company_id'] },
      { column: 'category_id', keys: ['categoryId', 'category_id'] },
      { column: 'title', keys: ['title'] },
      { column: 'description', keys: ['description'] },
      { column: 'requirement', keys: ['requirement'] },
      { column: 'location', keys: ['location', 'location_city'] },
      { column: 'employment_type', keys: ['employmentType', 'employment_type', 'job_type'] },
      { column: 'experience_level', keys: ['experienceLevel', 'experience_level'] },
      { column: 'location_type', keys: ['locationType', 'location_type'] },
      { column: 'salary_min', keys: ['salaryMin', 'salary_min'] },
      { column: 'salary_max', keys: ['salaryMax', 'salary_max'] },
      { column: 'is_salary_visible', keys: ['isSalaryVisible', 'is_salary_visible'] },
      { column: 'status', keys: ['status'] },
    ];

    const values = [];
    const setClauses = [];

    fieldMappings.forEach(({ column, keys }) => {
      const value = getPayloadValue(payload, keys);

      if (value !== undefined) {
        values.push(value === '' ? null : value);
        setClauses.push(`${column} = $${values.length}`);
      }
    });

    values.push(id);

    try {
      const result = await pool.query(
        `UPDATE jobs
         SET ${setClauses.join(', ')},
             updated_at = current_timestamp
         WHERE id = $${values.length}
         RETURNING id`,
        values,
      );

      if (result.rowCount === 0) {
        throw new NotFoundError('Lowongan pekerjaan tidak ditemukan');
      }
    } catch (error) {
      if (error.code === '23503') {
        throw new InvariantError('Perusahaan atau kategori tidak ditemukan');
      }
      throw error;
    }
  },

  async deleteJobById(id) {
    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);

    if (result.rowCount === 0) {
      throw new NotFoundError('Lowongan pekerjaan tidak ditemukan');
    }
  },
};

module.exports = JobService;
