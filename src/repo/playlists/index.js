const { Pool } = require('pg');

class PlaylistsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async insertPlaylist({
    id,
    name,
    owner,
    createdAt,
  }) {
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, name, owner, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findAllPlaylists(owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists  AS p INNER JOIN users AS u ON u.id = p.owner LEFT JOIN collaborations AS c ON c.playlist_id = p.id WHERE p.owner = $1 OR c.user_id = $1`,
      values: [owner],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistById(id, owner) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2 RETURNING id',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async insertPlaylistSong({
    id,
    playlistId,
    songId,
    createdAt,
  }) {
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, playlistId, songId, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findPlaylistSong(playlistId, songId) {
    const query = {
      text: `SELECT id FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findPlaylistByIdAndOwner(playlistId, owner) {
    const query = {
      text: `SELECT p.id, p.name, u.username FROM playlists AS p INNER JOIN users AS u ON u.id = p.owner LEFT JOIN collaborations AS c ON c.playlist_id = p.id WHERE p.id = $1 AND (p.owner = $2 OR c.user_id = $2)`,
      values: [playlistId, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0] || null;
  }

  async findAllPlaylistSongs(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer FROM playlist_songs AS ps INNER JOIN songs AS s ON s.id = ps.song_id WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deletePlaylistSongById(id, owner) {
    const query = {
      text: 'DELETE FROM playlists AS p LEFT JOIN collaborations AS c ON c.playlist_id = p.id WHERE p.id = $1 AND (p.owner = $2 OR c.user_id = $2) RETURNING id',
      values: [id, owner],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findPlaylistActivitiesHandler(playlistId) {
    const query = {
      text: `SELECT u.username, p.title, p.action, p.created_at AS time FROM playlist_log_activities AS p LEFT JOIN users AS u ON u.id = p.user_id WHERE p.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows || null;
  }
}

module.exports = PlaylistsRepository;
