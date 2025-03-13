// utils/logger.js
const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      level: 'debug', // Tambahkan level debug di sini!
    }
  }
});

module.exports = logger; // EXPORT LANGSUNG OBJEK LOGGER
