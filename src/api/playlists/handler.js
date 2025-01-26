class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
    this.deletePlaylistSongByIdHandler = this.deletePlaylistSongByIdHandler.bind(this);
    this.getPlaylistActivitiesHandler = this.getPlaylistActivitiesHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const { userId: credentialId } = request.auth.credentials;

    const playlistId = await this._service.addPlaylist({ name, owner: credentialId });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    });

    response.code(201);

    return response;
  }

  async getPlaylistsHandler(request) {
    const { userId: credentialId } = request.auth.credentials;

    const playlists = await this._service.getPlaylists(credentialId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { userId: credentialId } = request.auth.credentials;

    await this._service.deletePlaylistById(id, credentialId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { userId } = request.auth.credentials;

    this._validator.validatePlaylistParam({ playlistId });
    this._validator.validatePlaylistSongPayload({ songId });

    await this._service.addPlaylistSong({ playlistId, songId, userId });

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

    const playlist = await this._service.getPlaylistSongs(playlistId, userId);

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

    await this._service.deletePlaylistSongById(playlistId, songId, userId);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    this._validator.validatePlaylistParam({ playlistId });

    const data = await this._service.getPlaylistActivitiesHandler(playlistId, userId);

    return {
      status: 'success',
      data,
    };
  }
}

module.exports = PlaylistsHandler;
