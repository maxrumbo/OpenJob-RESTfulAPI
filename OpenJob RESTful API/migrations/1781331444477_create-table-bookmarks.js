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
  pgm.createTable("bookmarks", {
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
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("bookmarks", "bookmarks_user_job_unique", {
    unique: ["user_id", "job_id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("bookmarks");
};
