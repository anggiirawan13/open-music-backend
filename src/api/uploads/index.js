const routes = require('./routes');
const UploadsHandler = require('./handler');

module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { storageService, validator }) => {
    const uploadsHandler = new UploadsHandler(storageService, validator);
    server.route(routes(uploadsHandler));
  },
};
