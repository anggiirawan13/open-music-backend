const ExportPlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exportPlaylists',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const exportPlaylistsHandler = new ExportPlaylistsHandler(service, validator);
    server.route(routes(exportPlaylistsHandler));
  },
};
