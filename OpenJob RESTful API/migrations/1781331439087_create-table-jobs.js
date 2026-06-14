/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("jobs", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    company_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"companies"',
      onDelete: "CASCADE",
    },
    category_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"categories"',
      onDelete: "RESTRICT",
    },
    created_by: {
      type: "varchar(50)",
      references: '"users"',
      onDelete: "SET NULL",
    },
    title: {
      type: "varchar(150)",
      notNull: true,
    },
    description: {
      type: "text",
      notNull: true,
    },
    requirement: {
      type: "text",
    },
    location: {
      type: "varchar(150)",
    },
    employment_type: {
      type: "varchar(50)",
      notNull: true,
      default: "full-time",
      check:
        "employment_type IN ('full-time', 'part-time', 'contract', 'internship', 'freelance')",
    },
    experience_level: {
      type: "varchar(50)",
    },
    location_type: {
      type: "varchar(50)",
    },
    salary_min: {
      type: "integer",
    },
    salary_max: {
      type: "integer",
    },
    is_salary_visible: {
      type: "boolean",
      notNull: true,
      default: true,
    },
    status: {
      type: "varchar(30)",
      notNull: true,
      default: "open",
      check: "status IN ('open', 'close')",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("jobs");
};
