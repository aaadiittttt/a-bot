// utils/logger.js
const pino = require('pino');

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      level: 'debug', // Aktifkan level debug
    }
  }
});

module.exports = logger; // Ekspor objek logger LANGSUNG
