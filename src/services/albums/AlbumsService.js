const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils/albums');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AlbumsRepository = require('../../repo/albums');
const SongsRepository = require('../../repo/songs');

class AlbumsService {
  constructor() {
    this._albumsRepository = new AlbumsRepository();
    this._songsRepository = new SongsRepository();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const result = await this._albumsRepository.insertAlbum({
      id,
      name,
      year,
      createdAt,
    });

    if (!result) throw new InvariantError('Album gagal ditambahkan');

    return result;
  }

  async getAlbums() {
    const albums = await this._albumsRepository.findAllAlbums();
    return albums.map(mapDBToModel);
  }

  async getAlbumById(id) {
    const album = await this._albumsRepository.findAlbumById(id);
    if (!album) throw new NotFoundError('Album tidak ditemukan');

    const songs = await this._songsRepository.findSongsByAlbumId(id);
    return {
      ...album,
      songs,
    };
  }

  async editAlbumById(id, { name, year }) {
    const updatedAt = new Date().toISOString();

    const result = await this._albumsRepository.updateAlbumById(id, {
      name,
      year,
      updatedAt,
    });

    if (!result) throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
  }

  async deleteAlbumById(id) {
    const result = await this._albumsRepository.deleteAlbumById(id);

    if (!result) throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
  }
}

module.exports = AlbumsService;
