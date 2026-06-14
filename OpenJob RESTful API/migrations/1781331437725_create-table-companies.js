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
  pgm.createTable("companies", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    owner_id: {
      type: "varchar(50)",
      references: '"users"',
      onDelete: "SET NULL",
    },
    name: {
      type: "varchar(150)",
      notNull: true,
      unique: true,
    },
    description: {
      type: "text",
    },
    website: {
      type: "varchar(255)",
    },
    location: {
      type: "varchar(150)",
    },
    industry: {
      type: "varchar(100)",
    },
    size: {
      type: "varchar(50)",
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
  pgm.dropTable("companies");
};
