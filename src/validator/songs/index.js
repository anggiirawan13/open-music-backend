const {
  SongPayloadSchema,
  SongQuerySchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) throw new InvariantError(validationResult.error.message);
  },
  validateSongQuery: (query) => {
    const validationResult = SongQuerySchema.validate(query);
    if (validationResult.error) throw new Error(validationResult.error.message);
    return validationResult;
  },
};

module.exports = SongsValidator;
