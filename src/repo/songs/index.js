const { Pool } = require('pg');

class SongsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async insertSong({
    id,
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
    createdAt,
  }) {
    const values = [id, title, year, genre, performer, duration, albumId, createdAt];
    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
      values,
    };

    const result = await this._pool.query(query);
    return result.rows[0]?.id || null;
  }

  async findAllSongs(title, performer) {
    const conditions = [];
    const values = [];

    if (title) {
      conditions.push(`title ILIKE $${values.length + 1}`);
      values.push(`%${title}%`);
    }

    if (performer) {
      conditions.push(`performer ILIKE $${values.length + 1}`);
      values.push(`%${performer}%`);
    }

    const query = {
      text: `SELECT id, title, performer FROM songs ${
        conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
      }`,
      values,
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async findSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async findSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async updateSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
    updatedAt,
  }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);
    return result.rows[0]?.id || null;
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0]?.id || null;
  }
}

module.exports = SongsRepository;
