class PlaylistSongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;

    this._validator.validatePlaylistParam({ playlistId });
    this._validator.validatePlaylistSongPayload({ songId });

    await this._service.save({ playlistId, songId, userId });

    const response = h.response({
      status: 'success',
      message: 'Playlist Song berhasil ditambahkan',
      data: {
        playlistId,
      },
    });

    response.code(201);

    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    this._validator.validatePlaylistParam({ playlistId });

    const playlist = await this._service.findAll(playlistId, userId);

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deletePlaylistSongByIdHandler(request) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;

    this._validator.validatePlaylistParam({ playlistId });
    this._validator.validatePlaylistSongPayload({ songId });

    await this._service.deleteByPlaylistIdAndSongId(playlistId, songId, userId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }
}

module.exports = PlaylistSongsHandler;
