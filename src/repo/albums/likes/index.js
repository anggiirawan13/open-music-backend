const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class UserAlbumLikesRepository {
  constructor() {
    this._pool = new Pool();
  }

  async like(userId, albumId) {
    const id = `ual-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, albumId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async unlike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async checkUserLikedAlbum(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async countAlbumLiked(albumId) {
    const query = {
      text: 'SELECT user_album_likes.album_id FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }
}

module.exports = UserAlbumLikesRepository;
