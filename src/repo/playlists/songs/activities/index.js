const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class ActivitiesRepository {
  constructor() {
    this._pool = new Pool();
  }

  async save(
    playlistId,
    userId,
    title,
    action,
  ) {
    const id = `${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, userId, title, action, createdAt],
    };

    await this._pool.query(query);
  }

  async findByPlaylistId(playlistId) {
    const query = {
      text: `SELECT u.username, p.title, p.action, p.created_at AS time 
                FROM playlist_song_activities AS p 
                    LEFT JOIN users AS u 
                        ON u.id = p.user_id 
                WHERE p.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }
}

module.exports = ActivitiesRepository;
