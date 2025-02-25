const fs = require('fs');
const { Pool } = require('pg');
const StorageRepository = require('../../repo/storage');

class StorageService {
  constructor(folder) {
    this._folder = folder;
    this._pool = new Pool();
    this._storageRepository = new StorageRepository();

    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  }

  writeFile(file, meta) {
    const filename = `${Date.now()}-${meta.filename}`;
    const path = `${this._folder}/${filename}`;
    const fileStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
      fileStream.on('error', (error) => reject(error));
      file.pipe(fileStream);
      file.on('end', () => resolve(filename));
    });
  }

  async postCover(cover, albumId) {
    await this._deleteOldCoverFromDirectory(albumId);

    const coverUrl = `${process.env.HOST}:${process.env.PORT}/upload/images/${cover}`;
    await this._storageRepository.updateCover(coverUrl, albumId);
  }

  async _deleteOldCoverFromDirectory(albumId) {
    const cover = await this._storageRepository.findCover(albumId);
    if (cover === null) return;

    const oldCover = cover.split('/');

    fs.unlinkSync(`${this._folder}/${oldCover[oldCover.length - 1]}`);
  }
}

module.exports = StorageService;
