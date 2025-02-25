const routes = (handler) => [
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: (request, h) => handler.getActivitiesHandler(request, h),
    options: {
      auth: 'open_music_backend_v3_jwt',
    },
  },
];

module.exports = routes;
