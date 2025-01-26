const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
});

const PlaylistParamSchema = Joi.object({
  playlistId: Joi.string().min(1).max(25).required(),
});

const PlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().min(1).max(21).required(),
});

module.exports = { PlaylistPayloadSchema, PlaylistParamSchema, PlaylistSongPayloadSchema };
