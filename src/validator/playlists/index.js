const {
  PlaylistPayloadSchema,
  PlaylistParamSchema,
  PlaylistSongPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validatePlaylistParam: (param) => {
    const validationResult = PlaylistParamSchema.validate(param);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
};

module.exports = PlaylistsValidator;
