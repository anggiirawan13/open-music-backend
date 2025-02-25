const autoBind = require('auto-bind');

class PlaylistActivitiesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async getActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { userId } = request.auth.credentials;

    this._validator.validatePlaylistParam({ playlistId });

    const data = await this._service.findByPlaylistId(playlistId, userId);

    return {
      status: 'success',
      data,
    };
  }
}

module.exports = PlaylistActivitiesHandler;
