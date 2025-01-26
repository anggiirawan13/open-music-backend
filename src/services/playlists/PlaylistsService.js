const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils/playlists');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const PlaylistsRepository = require('../../repo/playlists');
const SongsRepository = require('../../repo/songs');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const ClientError = require('../../exceptions/ClientError');
const PlaylistSongLogActivities = require('../activities/playlist_songs/PlaylistSongLogActivities');

class PlaylistsService {
  constructor(collaborationService) {
    this._pool = new Pool();
    this._playlistsRepository = new PlaylistsRepository();
    this._songsRepository = new SongsRepository();
    this._playlistSongLogActivities = new PlaylistSongLogActivities();
    this._collaborationService = collaborationService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const result = await this._playlistsRepository.insertPlaylist({
      id,
      name,
      owner,
      createdAt,
    });

    if (!result) throw new InvariantError('Playlist gagal ditambahkan');

    return result;
  }

  async getPlaylists(owner) {
    const playlists = await this._playlistsRepository.findAllPlaylists(owner);
    return playlists.map(mapDBToModel);
  }

  async deletePlaylistById(id, owner) {
    await this.verifyPlaylistOwner(id, owner);

    const result = await this._playlistsRepository.deletePlaylistById(id, owner);

    if (!result) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }

  async addPlaylistSong({ playlistId, songId, userId }) {
    const id = `playlist-song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    await this.verifyPlaylistAccess(playlistId, userId);
    const song = await this.validateSongId(songId);

    const playlistSongId = await this._playlistsRepository.findPlaylistSong(playlistId, songId);
    if (playlistSongId) throw new ClientError('Song sudah ditambahkan ke dalam playlist');

    const result = await this._playlistsRepository.insertPlaylistSong({
      id,
      playlistId,
      songId,
      createdAt,
    });

    if (!result) throw new InvariantError('Playlist Song gagal ditambahkan');

    await this._playlistSongLogActivities.save(
      playlistId,
      userId,
      song.title,
      'add',
    );

    return result;
  }

  async getPlaylistSongs(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const playlist = await this._playlistsRepository.findPlaylistByIdAndOwner(playlistId, userId);
    if (!playlist) throw new NotFoundError('Playlist tidak ditemukan');

    const songs = await this._playlistsRepository.findAllPlaylistSongs(playlistId);

    return {
      ...playlist,
      songs,
    };
  }

  async deletePlaylistSongById(playlistId, songId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const playlist = await this._playlistsRepository.findPlaylistByIdAndOwner(playlistId, userId);
    if (!playlist) throw new NotFoundError('Playlist tidak ditemukan');

    const song = await this.validateSongId(songId);

    const result = await this._playlistsRepository.deletePlaylistSong(playlistId, songId);

    if (!result) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');

    await this._playlistSongLogActivities.save(
      playlistId,
      userId,
      song.title,
      'delete',
    );
  }

  async validateSongId(songId) {
    const song = await this._songsRepository.findSongById(songId);
    if (!song) throw new NotFoundError('Song tidak ditemukan');

    return song;
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) throw new NotFoundError('Resource yang Anda minta tidak ditemukan');

    const playlist = result.rows[0];
    if (playlist.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }

  async getPlaylistActivitiesHandler(playlistId, userId) {
    await this.verifyPlaylistOwner(playlistId, userId);

    const playlist = await this._playlistsRepository.findPlaylistByIdAndOwner(playlistId, userId);
    if (!playlist) throw new NotFoundError('Playlist tidak ditemukan');

    const activities = await this._playlistsRepository.findPlaylistActivitiesHandler(playlistId);

    return {
      playlistId: playlist.id,
      activities,
    };
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;

      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
