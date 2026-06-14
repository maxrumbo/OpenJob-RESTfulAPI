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
  pgm.createTable("documents", {
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
    filename: {
      type: "varchar(255)",
      notNull: true,
    },
    original_name: {
      type: "varchar(255)",
      notNull: true,
    },
    mime_type: {
      type: "varchar(100)",
      notNull: true,
    },
    size: {
      type: "integer",
      notNull: true,
    },
    path: {
      type: "text",
      notNull: true,
    },
    uploaded_at: {
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
  pgm.dropTable("documents");
};
