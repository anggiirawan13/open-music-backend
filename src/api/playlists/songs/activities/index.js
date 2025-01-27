const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistActivities',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(service, validator);
    server.route(routes(playlistActivitiesHandler));
  },
};
