const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class CollaborationsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async save(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }

  async deleteByPlaylistIdAndUserId(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }

  async findByPlaylistIdAndUserId(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }
}

module.exports = CollaborationsRepository;
