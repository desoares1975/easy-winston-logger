'use strict';

const winston = require('winston');
const { MongoDB } = require('winston-mongodb');
const DailyRotateFile = require('winston-daily-rotate-file');

const VALID_TYPES = ['console', 'mongodb', 'file'];

const transports = {
  console: winston.transports.Console,
  mongodb: MongoDB,
  file: DailyRotateFile
};

winston.addColors({
  error: 'red',
  debug: 'yellow',
  info: 'blue',
  silly: 'green'
});

function createLogger(config) {
  if (config !== undefined && (config === null || (typeof config !== 'string' && typeof config !== 'object'))) {
    throw new Error('Invalid config: expected an object or string');
  }

  const configuration = (typeof config === 'object') ? config : {
    turnOff: false,
    type: (typeof config === 'string' ? config : 'console'),
    options: {
      console: {
        colorize: 'all',
        level: 'silly',
        timestamp: true
      },
      file: {
        filename: 'logs',
        maxsize: 10240,
        level: 'error',
        timestamp: true
      },
      mongodb: {
        db: 'mongodb://localhost:27017/logger',
        collection: 'logs',
        level: 'error',
        timestamp: true
      }
    }
  };

  const type = configuration.type || 'console';

  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Unknown transport type: ${type}`);
  }

  if (configuration.turnOff) {
    return winston.createLogger({ silent: true });
  }

  const Transport = transports[type];

  if (type === 'file') {
    configuration.options.file.filename = `${configuration.options.file.name || 'logs'}-%DATE%.log`;
    configuration.options.file.handleExceptions = true;
    configuration.options.file.datePattern = 'YYYY-MM-DD';
  }

  return winston.createLogger({
    transports: [new Transport(configuration.options[type])],
    silent: false
  });
}

module.exports = createLogger;
