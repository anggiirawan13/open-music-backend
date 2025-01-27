// Repository
const AuthenticationsRepository = require('../../repo/authentications');

// Exception
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._authenticationsRepository = new AuthenticationsRepository();
  }

  async save(refreshToken) {
    await this._authenticationsRepository.save(refreshToken);
  }

  async verifyRefreshToken(refreshToken) {
    const result = await this._authenticationsRepository.verifyRefreshToken(refreshToken);

    if (!result.length) throw new InvariantError('Refresh token tidak valid');
  }

  async deleteByRefreshToken(refreshToken) {
    await this._authenticationsRepository.deleteByRefreshToken(refreshToken);
  }
}

module.exports = AuthenticationsService;
