// Exception
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Repository
const AlbumsRepository = require('../../repo/albums');
const SongsRepository = require('../../repo/songs');

class AlbumsService {
  constructor() {
    this._albumsRepository = new AlbumsRepository();
    this._songsRepository = new SongsRepository();
  }

  async save({
    name,
    year,
  }) {
    const result = await this._albumsRepository.save({
      name,
      year,
    });

    if (!result) throw new InvariantError('Album gagal ditambahkan');

    return result;
  }

  async findAll() {
    return this._albumsRepository.findAll();
  }

  async findById(id) {
    const album = await this._albumsRepository.findById(id);
    if (!album) throw new NotFoundError('Album tidak ditemukan');

    const songs = await this._songsRepository.findByAlbumId(id);

    return {
      ...album,
      songs,
    };
  }

  async updateById(id, { name, year }) {
    const result = await this._albumsRepository.updateById(id, name, year);

    if (!result) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }

  async deleteById(id) {
    const result = await this._albumsRepository.deleteById(id);

    if (!result) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }
}

module.exports = AlbumsService;
