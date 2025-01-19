const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
  year: Joi.number().integer().min(1970).max(new Date().getFullYear())
    .required(),
});

module.exports = { AlbumPayloadSchema };
