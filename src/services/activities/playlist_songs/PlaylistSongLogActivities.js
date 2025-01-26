const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class PlaylistSongLogActivities {
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
      text: 'INSERT INTO playlist_log_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, userId, title, action, createdAt],
    };

    await this._pool.query(query);
  }
}

module.exports = PlaylistSongLogActivities;
