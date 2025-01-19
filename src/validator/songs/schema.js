const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().min(1).max(30).required(),
  year: Joi.number().integer().min(1970).max(new Date().getFullYear())
    .required(),
  genre: Joi.string().min(1).max(10).required(),
  performer: Joi.string().min(1).max(20).required(),
  duration: Joi.number().integer(),
  albumId: Joi.string().min(22).max(22),
});

const SongQuerySchema = Joi.object({
  title: Joi.string().empty(''),
  performer: Joi.string().empty(''),
});

module.exports = { SongPayloadSchema, SongQuerySchema };
