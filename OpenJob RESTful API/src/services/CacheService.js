const { createClient } = require('redis');

class CacheService {
  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST,
      },
    });

    this.client.on('error', (error) => {
      console.error('Redis error:', error);
    });

    this.client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this.client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this.client.get(key);
    if (result === null) {
      throw new Error('Cache tidak ditemukan');
    }
    return result;
  }

  async delete(key) {
    await this.client.del(key);
  }
}

module.exports = new CacheService();