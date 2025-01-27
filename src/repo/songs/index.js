const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class SongsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async save({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $8) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findAll(title, performer) {
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

  async findById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0] || null;
  }

  async findByAlbumId(albumId) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async updateById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updatedAt, id],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async deleteById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }
}

module.exports = SongsRepository;
