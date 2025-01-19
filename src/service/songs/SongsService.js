const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils/songs');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const SongsRepository = require('../../repo/songs');
const AlbumsRepository = require('../../repo/albums');

class SongsService {
  constructor() {
    this._songsRepository = new SongsRepository();
    this._albumsRepository = new AlbumsRepository();
  }

  async addSong({
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    if (albumId) await this.validateAlbumId(albumId);

    const result = await this._songsRepository.insertSong({
      id,
      title,
      year,
      genre,
      performer,
      duration,
      albumId,
      createdAt,
    });

    if (!result) throw new InvariantError('Song gagal ditambahkan');

    return result;
  }

  async getSongs(title, performer) {
    const songs = await this._songsRepository.findAllSongs(title, performer);
    return songs.map(mapDBToModel);
  }

  async getSongById(id) {
    const song = await this._songsRepository.findSongById(id);

    if (!song) throw new NotFoundError('Song tidak ditemukan');

    return mapDBToModel(song);
  }

  async editSongById(id, {
    title,
    year,
    genre,
    performer,
    duration,
    albumId,
  }) {
    const updatedAt = new Date().toISOString();

    if (albumId) await this.validateAlbumId(albumId);

    const result = await this._songsRepository.updateSongById(id, {
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

  async deleteSongById(id) {
    const result = await this._songsRepository.deleteSongById(id);

    if (!result) throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
  }

  async validateAlbumId(albumId) {
    const album = await this._albumsRepository.findAlbumById(albumId);
    if (!album) throw new NotFoundError('Album tidak ditemukan');
  }
}

module.exports = SongsService;
