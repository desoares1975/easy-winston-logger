
const winston = require('winston');
require('winston-mongodb').MongoDB;
require('winston-daily-rotate-file');
const transports = {
  'console': winston.transports.Console,
  'mongodb': winston.transports.MongoDB,
  'file': winston.transports.DailyRotateFile
};


winston.addColors({
  'error': 'red',
  'debug': 'yellow',
  'info': 'blue',
  'silly': 'green'
});

const logger = config => {
  let configuration = ((typeof config === 'object') ? config : {
    'turnOff': false,
    'type': (typeof config === 'string' ? config : 'console'),
    'options': {
      'console': {
        'colorize': 'all',
        'level': 'silly',
        'timestamp': true
      },
      'file': {
        'filename': 'logs',
        'maxsize': 10240,
        'level': 'error',
        'timestamp': true
      },
      'mongodb': {
        'db': 'mongodb://localhost:27017/mobiserver',
        'collection': 'logs',
        'level': 'error',
        'timestamp': true
      }
    }
  });

  if (configuration.type === 'file') {
    configuration.options.file.name = configuration.type;
    configuration.options.file.handleExceptions = true;
    configuration.options.file.datePattern = '.yyyy-MM-dd.txt';
  }

  let logger = new winston.Logger({
    'transports': [new transports[configuration.type](configuration.options[configuration.type])]
  });

  logger.transports[configuration.type].silent = configuration.turnOff;

  return logger;
}

module.exports = logger;