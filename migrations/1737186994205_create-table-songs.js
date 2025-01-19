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
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
      check: 'year >= 1970 AND year <= EXTRACT(YEAR FROM NOW())',
    },
    genre: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    performer: {
      type: 'VARCHAR(20)',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: false,
      default: 0,
    },
    album_id: {
      type: 'VARCHAR(22)',
      notNull: false,
      default: '',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('NOW()'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('songs');
};
