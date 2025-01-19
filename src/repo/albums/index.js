const { Pool } = require('pg');

class AlbumsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async insertAlbum({
    id,
    name,
    year,
    createdAt,
  }) {
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, year, createdAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0]?.id || null;
  }

  async findAllAlbums() {
    const query = 'SELECT * FROM albums';
    const result = await this._pool.query(query);
    return result.rows;
  }

  async findAlbumById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async updateAlbumById(id, { name, year, updatedAt }) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);
    return result.rows[0]?.id || null;
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0]?.id || null;
  }
}

module.exports = AlbumsRepository;
