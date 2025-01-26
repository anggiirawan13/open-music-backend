/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlist_log_activities', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(25)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(30)',
      notNull: true,
    },
    action: {
      type: 'VARCHAR(6)',
      notNull: true,
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('NOW()'),
    },
  });

  pgm.addConstraint('playlist_log_activities', 'fk_playlist_log_activities.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_log_activities');
};
