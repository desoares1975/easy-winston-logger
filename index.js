'use strict';

const winston = require('winston');
require('winston-mongodb').MongoDB;
require('winston-daily-rotate-file');
const transports = {
  console: winston.transports.Console,
  mongodb: winston.transports.MongoDB,
  file: winston.transports.DailyRotateFile
};


winston.addColors({
  error: 'red',
  debug: 'yellow',
  info: 'blue',
  silly: 'green'
});

function logger(config) {
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
  const options = configuration.type === 'mongodb' ? {
    poolSize: 2,
    useNewUrlParser: true,
    useUnifiedTopology: true
  } : null;

  if (configuration.type === 'file') {
    configuration.options.file.filename = `${configuration.options.file.name || 'logs'}-%DATE%.log`;
    configuration.options.file.handleExceptions = true;
    configuration.options.file.datePattern = 'YYYY-MM-DD';
  }

  let logger = winston.createLogger({
    transports: [new transports[configuration.type]({ ...configuration.options[configuration.type], options })],
    silent: !!configuration.turnOff
  });

  return logger;
};

module.exports = logger;