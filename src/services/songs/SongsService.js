const { mapDBToModel } = require('../../models/songs');

// Exception
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Repository
const SongsRepository = require('../../repo/songs');
const AlbumsRepository = require('../../repo/albums');

class SongsService {
  constructor() {
    this._songsRepository = new SongsRepository();
    this._albumsRepository = new AlbumsRepository();
  }

  async save({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    if (albumId) await this.validateAlbumId(albumId);

    const result = await this._songsRepository.save({
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
    });

    if (!result) throw new InvariantError('Song gagal ditambahkan');

    return result;
  }

  async findAll(title, performer) {
    const songs = await this._songsRepository.findAll(title, performer);
    return songs.map(mapDBToModel);
  }

  async findById(id) {
    const song = await this._songsRepository.findById(id);

    if (!song) throw new NotFoundError('Song tidak ditemukan');

    return mapDBToModel(song);
  }

  async updateById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const updatedAt = new Date().toISOString();

    if (albumId) await this.validateAlbumId(albumId);

    const result = await this._songsRepository.updateById(id, {
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      updatedAt,
    });

    if (!result) throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
  }

  async deleteById(id) {
    const result = await this._songsRepository.deleteById(id);

    if (!result) throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
  }

  async validateAlbumId(albumId) {
    const album = await this._albumsRepository.findById(albumId);
    if (!album) throw new NotFoundError('Album tidak ditemukan');
  }
}

module.exports = SongsService;
