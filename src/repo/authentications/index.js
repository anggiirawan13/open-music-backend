const { Pool } = require('pg');

class AuthenticationsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async save(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT refresh_token FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }

  async deleteByRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsRepository;
