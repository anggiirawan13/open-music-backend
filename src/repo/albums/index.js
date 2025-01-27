const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class AlbumsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async save({
    name,
    year,
  }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, year, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findAll() {
    const result = await this._pool.query('SELECT id, name, year FROM albums');

    return result.rows;
  }

  async findById(id) {
    const query = {
      text: 'SELECT id, name, year FROM albums WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0] || null;
  }

  async updateById(id, name, year) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async deleteById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }
}

module.exports = AlbumsRepository;
