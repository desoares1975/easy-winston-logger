'use strict';

const winston = require('winston');
require('winston-mongodb');
require('winston-daily-rotate-file');

const transports = {
  console: 'Console',
  mongodb: 'MongoDB',
  file: 'DailyRotateFile'
};



winston.addColors({
  error: 'red',
  debug: 'yellow',
  info: 'blue',
  silly: 'green'
});

function createLogger(config) {
  const configuration = ((typeof config === 'object') ? config : {
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
  });
  const transport = transports[configuration.type];
  const options = transport === 'MongoDB' ? {
    poolSize: 2,
    useNewUrlParser: true,
    useUnifiedTopology: true
  } : null;

  if (transport === 'DailyRotateFile') {
    configuration.options.file.filename = `${configuration.options.file.name || 'logs'}-%DATE%.log`;
    configuration.options.file.handleExceptions = true;
    configuration.options.file.datePattern = 'YYYY-MM-DD';
  }

  const logger = winston.createLogger({
    transports: [new winston.transports[transport]({ ...configuration.options[configuration.type], options })],
    silent: !!configuration.turnOff
  });

  return logger;
};

module.exports = createLogger;