// Error
const NotFoundError = require('../../../../exceptions/NotFoundError');

// Exception
const ActivitiesRepository = require('../../../../repo/playlists/songs/activities');
const PlaylistsRepository = require('../../../../repo/playlists');

class ActivitiesService {
  constructor(playlistsService) {
    // Service
    this._playlistsService = playlistsService;

    // Repository
    this._activitiesRepository = new ActivitiesRepository();
    this._playlistsRepository = new PlaylistsRepository();
  }

  async findByPlaylistId(playlistId, userId) {
    await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

    const playlist = await this._playlistsRepository.findPlaylistByIdAndOwner(playlistId, userId);
    if (!playlist) throw new NotFoundError('Playlist tidak ditemukan');

    const activities = await this._activitiesRepository.findByPlaylistId(playlistId);

    return {
      playlistId: playlist[0].id,
      activities,
    };
  }
}

module.exports = ActivitiesService;
