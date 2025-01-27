const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class PlaylistsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async save(name, owner) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findAllByOwner(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username
             FROM playlists AS p
                      INNER JOIN users AS u
                                 ON u.id = p.owner
                      LEFT JOIN collaborations AS c
                                ON c.playlist_id = p.id
             WHERE p.owner = $1
                OR c.user_id = $1 
             GROUP BY p.id, p.name, u.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteByIdAndOwner(id, owner) {
    const query = {
      text: `DELETE
             FROM playlists
             WHERE id = $1
               AND (owner = $2
                 OR id IN (SELECT playlist_id FROM collaborations WHERE user_id = $2))
             RETURNING id`,
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findById(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }

  async findPlaylistByIdAndOwner(playlistId, owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username 
                FROM playlists AS p 
                    INNER JOIN users AS u 
                        ON u.id = p.owner 
                    LEFT JOIN collaborations AS c 
                        ON c.playlist_id = p.id 
                WHERE p.id = $1 
                  AND (p.owner = $2 OR c.user_id = $2)`,
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }
}

module.exports = PlaylistsRepository;
