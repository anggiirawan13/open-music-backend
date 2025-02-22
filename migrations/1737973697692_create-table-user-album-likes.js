/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(21)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(23)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(22)',
      notNull: true,
    },
  });

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('user_album_likes');
};
