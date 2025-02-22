const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: handler.postUserAlbumLikeHandler,
    options: {
      auth: 'open_music_backend_v3_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: handler.getTotalAlbumLikesHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: handler.deleteUserAlbumLikeHandler,
    options: {
      auth: 'open_music_backend_v3_jwt',
    },
  },
];

module.exports = { routes };
