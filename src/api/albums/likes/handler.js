const AlbumsRepository = require('../../../repo/albums');
const NotFoundError = require('../../../exceptions/NotFoundError');
const UsersRepository = require('../../../repo/users');
const autoBind = require('auto-bind');

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService) {
    this._userAlbumLikesService = userAlbumLikesService;

    this._albumsRepository = new AlbumsRepository();
    this._usersRepository = new UsersRepository();

    autoBind(this);
  }

  async postUserAlbumLikeHandler(request, h) {
    const { userId } = request.auth.credentials;
    const result = await this._usersRepository.findById(userId);
    if (!result.length) throw new NotFoundError('User tidak ditemukan');

    const { id: albumId } = request.params;
    const album = await this._albumsRepository.findById(albumId);
    if (!album) throw new NotFoundError('Album tidak ditemukan');

    const statusUser = await this._userAlbumLikesService.checkUserLikedAlbum(userId, albumId);

    if (statusUser < 1) await this._userAlbumLikesService.likeAlbum(userId, albumId);
    else {
      return h.response({
        status: 'fail',
        message: 'Batal menyukai album',
      }).code(400);
    }

    return h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    }).code(201);
  }

  async getTotalAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const album = await this._albumsRepository.findById(albumId);
    if (!album) throw new NotFoundError('Album tidak ditemukan');

    const { totalLikes, source } = await this._userAlbumLikesService.countAlbumLiked(albumId);

    return h.response({
      status: 'success',
      data: {
        likes: totalLikes,
      },
    }).header('X-Data-Source', source);
  }

  async deleteUserAlbumLikeHandler(request, h) {
    const { userId } = request.auth.credentials;
    const result = await this._usersRepository.findById(userId);
    if (!result.length) throw new NotFoundError('User tidak ditemukan');

    const { id: albumId } = request.params;
    const album = await this._albumsRepository.findById(albumId);
    if (!album) throw new NotFoundError('Album tidak ditemukan');

    const statusUser = await this._userAlbumLikesService.checkUserLikedAlbum(userId, albumId);

    if (statusUser > 0) await this._userAlbumLikesService.unlikeAlbum(userId, albumId);

    return h.response({
      status: 'success',
      message: 'Batal menyukai album',
    }).code(200);
  }
}

module.exports = UserAlbumLikesHandler;
