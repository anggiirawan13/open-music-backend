const bcrypt = require('bcrypt');

// Exceptions
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

// Repository
const UsersRepository = require('../../repo/users');

class UsersService {
  constructor() {
    this._usersRepository = new UsersRepository();
  }

  async save({ username, password, fullname }) {
    await this.verifyNewUsername(username);

    const result = await this._usersRepository.save({ username, password, fullname });
    if (!result.length) throw new InvariantError('User gagal ditambahkan');

    return result[0].id;
  }

  async findById(userId) {
    const result = await this._usersRepository.findById(userId);
    if (!result.length) throw new NotFoundError('User tidak ditemukan');

    return result[0];
  }

  async verifyNewUsername(username) {
    const result = await this._usersRepository.findByUsername(username);
    if (result.length) throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
  }

  async verifyUserCredential(username, password) {
    const result = await this._usersRepository.findByUsername(username);
    if (!result.length) throw new AuthenticationError('Kredensial yang Anda berikan salah');

    const hashedPassword = result[0].password;
    const match = await bcrypt.compare(password, hashedPassword);
    if (!match) throw new AuthenticationError('Kredensial yang Anda berikan salah');

    return result[0].id;
  }
}

module.exports = UsersService;
