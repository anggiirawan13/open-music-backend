// Exception
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Repository
const UsersRepository = require('../../repo/users');
const CollaborationsRepository = require('../../repo/collaborations');

class CollaborationsService {
  constructor(cacheService) {
    this._collaborationsRepository = new CollaborationsRepository();
    this._usersRepository = new UsersRepository();
    this._cacheService = cacheService;
  }

  async save(playlistId, userId) {
    const user = await this._usersRepository.findById(userId);
    if (!user.length) throw new NotFoundError('User tidak ditemukan');

    const result = await this._collaborationsRepository.save(playlistId, userId);
    if (!result.length) throw new InvariantError('Kolaborasi gagal ditambahkan');

    await this._cacheService.delete(`playlistsongs:${playlistId}`);

    return result[0].id;
  }

  async deleteByPlaylistIdAndUserId(playlistId, userId) {
    const result = await this._collaborationsRepository.deleteByPlaylistIdAndUserId(playlistId, userId);

    if (!result.length) throw new InvariantError('Kolaborasi gagal dihapus');

    await this._cacheService.delete(`playlistsongs:${playlistId}`);
  }

  async verifyCollaborator(playlistId, userId) {
    const result = await this._collaborationsRepository.findByPlaylistIdAndUserId(playlistId, userId);
    if (!result.length) throw new InvariantError('Kolaborasi gagal diverifikasi');
  }
}

module.exports = CollaborationsService;
