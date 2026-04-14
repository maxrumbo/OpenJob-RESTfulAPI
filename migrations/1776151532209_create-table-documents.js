exports.up = (pgm) => {
  pgm.createTable('documents', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    file_url: {
      type: 'TEXT',
      notNull: true,
    },
    mime_type: {
      type: 'VARCHAR(100)',
    },
    size: {
      type: 'INTEGER',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('documents');
};
