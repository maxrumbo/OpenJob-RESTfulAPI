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
  pgm.createIndex("jobs", "company_id");
  pgm.createIndex("jobs", "category_id");
  pgm.createIndex("jobs", "title");
  pgm.createIndex("applications", "user_id");
  pgm.createIndex("applications", "job_id");
  pgm.createIndex("bookmarks", "user_id");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropIndex("bookmarks", "user_id");
  pgm.dropIndex("applications", "job_id");
  pgm.dropIndex("applications", "user_id");
  pgm.dropIndex("jobs", "title");
  pgm.dropIndex("jobs", "category_id");
  pgm.dropIndex("jobs", "company_id");
};
