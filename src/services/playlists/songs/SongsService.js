// Exceptions
const ClientError = require('../../../exceptions/ClientError');
const InvariantError = require('../../../exceptions/InvariantError');
const NotFoundError = require('../../../exceptions/NotFoundError');

// Repository
const SongsRepository = require('../../../repo/songs');
const PlaylistSongsRepository = require('../../../repo/playlists/songs');
const PlaylistActivitiesRepository = require('../../../repo/playlists/songs/activities');

class SongsService {
  constructor(collaborationService, playlistsService, cacheService) {
    // Service
    this._collaborationService = collaborationService;
    this._playlistsService = playlistsService;
    this._cacheService = cacheService;

    // Repository
    this._playlistSongsRepository = new PlaylistSongsRepository();
    this._playlistActivitiesRepository = new PlaylistActivitiesRepository();
    this._songsRepository = new SongsRepository();
  }

  async save({ playlistId, songId, userId }) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const song = await this.validateSongId(songId);

    const playlistSongId = await this._playlistSongsRepository.findByPlaylistIdAndSongId(playlistId, songId);
    if (playlistSongId) throw new ClientError('Song sudah ditambahkan ke dalam playlist');

    const result = await this._playlistSongsRepository.save(playlistId, songId);
    if (!result) throw new InvariantError('Playlist Song gagal ditambahkan');

    await this._playlistActivitiesRepository.save(
      playlistId,
      userId,
      song.title,
      'add',
    );

    await this._cacheService.delete(`playlistsongs:${playlistId}`);

    return result;
  }

  async findAll(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const playlist = await this._playlistSongsRepository.findByPlaylistIdAndOwner(playlistId, userId);
    if (!playlist) throw new NotFoundError('Playlist tidak ditemukan');

    const songs = await this._playlistSongsRepository.findByPlaylistId(playlistId);

    return {
      ...playlist,
      songs,
    };
  }

  async deleteByPlaylistIdAndSongId(playlistId, songId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const playlist = await this._playlistSongsRepository.findByPlaylistIdAndOwner(playlistId, userId);
    if (!playlist) throw new NotFoundError('Playlist tidak ditemukan');

    const song = await this.validateSongId(songId);

    const result = await this._playlistSongsRepository.deleteByPlaylistIdAndSongId(playlistId, songId);
    if (!result) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');

    await this._playlistActivitiesRepository.save(
      playlistId,
      userId,
      song.title,
      'delete',
    );

    await this._cacheService.delete(`playlistsongs:${playlistId}`);
  }

  async validateSongId(songId) {
    const song = await this._songsRepository.findById(songId);
    if (!song) throw new NotFoundError('Song tidak ditemukan');

    return song;
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
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

module.exports = SongsService;
