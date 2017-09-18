
const winston = require('winston');
require('winston-mongodb').MongoDB;
const transports = {
  'console': winston.transports.Console,
  'mongodb': winston.transports.MongoDB,
  'file': winston.transports.File
};


winston.addColors({
  'error': 'red',
  'debug': 'yellow',
  'info': 'blue',
  'prod': 'green'
});

const logger = config => {
  let configuration = ((typeof config === 'object') ? config : {
    'type': (typeof config === 'string' ? config : 'console'),
    'options': {
      'console': {
        'colorize': 'all',
        'level': process.env.LOG_LEVEL || 'info',
        'timestamp': true
      },
      'file': {
        'filename': 'logs.txt',
        'level': process.env.LOG_LEVEL || 'error',
        'timestamp': true
      },
      'mongodb': {
        'db': 'mongodb://localhost:27017/mobiserver',
        'collection': 'logs',
        'level': process.env.LOG_LEVEL || 'error',
        'timestamp': true
      }
    }
  });

  let logger = new winston.Logger({
    'transports': [new transports[configuration.type](configuration.options[configuration.type])]
  });

  if (config.turnOff) {
    winston.remove(winston.transports[configuration.type]);
  }

  return logger;
}

module.exports = logger;