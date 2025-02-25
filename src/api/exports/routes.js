const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlists/{playlistId}',
    handler: handler.postExportPlaylistsHandler,
    options: {
      auth: 'open_music_backend_v3_jwt',
    },
  },
];

module.exports = routes;
