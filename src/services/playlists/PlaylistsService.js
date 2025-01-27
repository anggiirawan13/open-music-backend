// Exceptions
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Repository
const PlaylistsRepository = require('../../repo/playlists');

class PlaylistsService {
  constructor() {
    this._playlistsRepository = new PlaylistsRepository();
  }

  async save({ name, owner }) {
    const result = await this._playlistsRepository.save(name, owner);
    if (!result) throw new InvariantError('Playlist gagal ditambahkan');

    return result;
  }

  async findAll(owner) {
    return this._playlistsRepository.findAllByOwner(owner);
  }

  async deleteById(id, owner) {
    await this.verifyPlaylistOwner(id, owner);

    const result = await this._playlistsRepository.deleteByIdAndOwner(id, owner);
    if (!result) throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const result = await this._playlistsRepository.findById(playlistId);
    if (!result.length) throw new NotFoundError('Resource yang Anda minta tidak ditemukan');

    const playlist = result[0];
    if (playlist.owner !== owner) throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
  }
}

module.exports = PlaylistsService;
