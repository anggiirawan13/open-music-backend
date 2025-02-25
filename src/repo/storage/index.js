const { Pool } = require('pg');

class StorageRepository {
  constructor() {
    this._pool = new Pool();
  }

  async updateCover(coverUrl, albumId) {
    const queryUpdate = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2',
      values: [coverUrl, albumId],
    };

    return this._pool.query(queryUpdate);
  }

  async findCover(coverUrl, albumId) {
    const queryGetCover = {
      text: 'SELECT cover FROM albums WHERE id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(queryGetCover);

    return result.rows[0]?.cover || null;
  }
}

module.exports = StorageRepository;
