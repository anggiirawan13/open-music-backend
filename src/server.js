const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Exceptions
const ClientError = require('./exceptions/ClientError');

// Env
require('dotenv').config();

// Albums
const albums = require('./api/albums');
const AlbumsService = require('./services/albums/AlbumsService');
const AlbumsValidator = require('./validator/albums');

// Songs
const songs = require('./api/songs');
const SongsService = require('./services/songs/SongsService');
const SongsValidator = require('./validator/songs');

// Playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/playlists/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// Playlist Songs
const playlistSongs = require('./api/playlists/songs');
const PlaylistSongsService = require('./services/playlists/songs/SongsService');

// Playlist Activities
const playlistActivities = require('./api/playlists/songs/activities');
const PlaylistActivitiesService = require('./services/playlists/songs/activities/ActivitiesService');

// Users
const users = require('./api/users');
const UsersService = require('./services/users/UsersService');
const UsersValidator = require('./validator/users');

// Authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/authentications/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// Collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/collaborations/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// Likes
const likes = require('./api/albums/likes');
const UserAlbumLikesService = require('./services/albums/likes/UserAlbumLikesService');

// Exports
const exportPlaylist = require('./api/exports');
const ProducerService = require('./services/messaging/publisher/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// cache
const CacheService = require('./services/caching/CacheService');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const collaborationsService = new CollaborationsService(cacheService);
  const playlistsService = new PlaylistsService();
  const playlistSongsService = new PlaylistSongsService(collaborationsService, playlistsService, cacheService);

  const playlistActivitiesService = new PlaylistActivitiesService(playlistsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

  const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/images'));
  const userAlbumLikesService = new UserAlbumLikesService(cacheService);

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('open_music_backend_v3_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        service: playlistSongsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistActivities,
      options: {
        service: playlistActivitiesService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportPlaylist,
      options: {
        producerService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        storageService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: likes,
      options: {
        userAlbumLikesService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });

      newResponse.code(response.statusCode);

      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
