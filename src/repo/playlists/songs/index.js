const { Pool } = require('pg');
const { nanoid } = require('nanoid');

class PlaylistSongsRepository {
  constructor() {
    this._pool = new Pool();
  }

  async save(playlistId, songId) {
    const id = `playlist-song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3, $4, $4) RETURNING id',
      values: [id, playlistId, songId, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findByPlaylistIdAndSongId(playlistId, songId) {
    const query = {
      text: 'SELECT id FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }

  async findByPlaylistIdAndOwner(playlistId, owner) {
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

    return result.rows[0] || null;
  }

  async findByPlaylistId(playlistId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer 
              FROM playlist_songs AS ps 
                  INNER JOIN songs AS s 
                      ON s.id = ps.song_id 
              WHERE ps.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteByPlaylistIdAndSongId(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    return result.rows[0]?.id || null;
  }
}

module.exports = PlaylistSongsRepository;
