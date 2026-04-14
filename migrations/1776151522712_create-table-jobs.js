exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    company_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"companies"',
      onDelete: 'CASCADE',
    },
    category_id: {
      type: 'VARCHAR(50)',
      references: '"categories"',
      onDelete: 'SET NULL',
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
    },
    location: {
      type: 'VARCHAR(255)',
    },
    type: {
      type: 'VARCHAR(50)',
    },
    salary_range: {
      type: 'VARCHAR(100)',
    },
    created_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('jobs');
};
