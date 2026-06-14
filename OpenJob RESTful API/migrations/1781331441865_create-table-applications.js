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
  pgm.createTable("applications", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    user_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    job_id: {
      type: "varchar(50)",
      notNull: true,
      references: '"jobs"',
      onDelete: "CASCADE",
    },
    document_id: {
      type: "varchar(50)",
      references: '"documents"',
      onDelete: "SET NULL",
    },
    cover_letter: {
      type: "text",
    },
    status: {
      type: "varchar(30)",
      notNull: true,
      default: "pending",
      check: "status IN ('pending', 'reviewed', 'accepted', 'rejected')",
    },
    applied_at: {
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

  pgm.addConstraint("applications", "applications_user_job_unique", {
    unique: ["user_id", "job_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("applications");
};
