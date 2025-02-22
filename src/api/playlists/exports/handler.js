class ExportPlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  async postExportPlaylistHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);

    const { targetEmail } = request.payload;
    const { userId: credentialId } = request.auth.credentials;

    // TODO export playlist

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
}

module.exports = ExportPlaylistsHandler;
