const { Pool } = require('pg');
const InvariantError = require('../../../exceptions/InvariantError');
const UserAlbumLikesRepository = require('../../../repo/albums/likes');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
    this._likesRepository = new UserAlbumLikesRepository();
  }

  async likeAlbum(userId, albumId) {
    const result = await this._likesRepository.like(userId, albumId);

    if (!result) throw new InvariantError('Gagal menyukai album');

    await this._cacheService.delete(`liked_album:${albumId}`);
    return result;
  }

  async unlikeAlbum(userId, albumId) {
    const result = await this._likesRepository.unlike(userId, albumId);

    if (!result) throw new InvariantError('Gagal untuk batal menyukai album');

    await this._cacheService.delete(`liked_album:${albumId}`);
    return result;
  }

  async checkUserLikedAlbum(userId, albumId) {
    return this._likesRepository.checkUserLikedAlbum(userId, albumId);
  }

  async countAlbumLiked(albumId) {
    let totalLikes;
    let source = 'cache';

    try {
      totalLikes = await this._cacheService.get(`liked_album:${albumId}`);
    } catch (error) {
      totalLikes = await this._likesRepository.countAlbumLiked(albumId);
      source = 'postgresql';

      await this._cacheService
        .set(`liked_album:${albumId}`, JSON.stringify(totalLikes));
    }

    return {
      totalLikes,
      source,
    };
  }
}

module.exports = UserAlbumLikesService;
