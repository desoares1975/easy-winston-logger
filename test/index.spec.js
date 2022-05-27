const assert = require('assert');
const logger = require('../index.js');

describe('Tests logger', () => {
  let info,
      silent,
      mongo,
      defaultLogger,
      defaultFile;

  beforeAll(() => {
    info = logger({
      type: 'console',
      options: {
        console: {
          colorize: 'all',
          level: 'silly',
          timestamp: true
        }
      }
    });
    silent = logger({
      type: 'console',
      turnOff: true,
      options: {
        console: {}
      }
    });
    mongo = logger({
      type: 'mongodb',
      turnOff: false,
      options: {
        mongodb: {
          db: 'mongodb://localhost:27017/test',
          collection: 'logs',
          level: 'debug',
          timestamp: true
        }
      }
    });
    defaultLogger = logger();
    stringOptionLogger = logger('console');
    file = logger({
      type: 'file',
      turnOff: false,
      options: {
        file: {
          name: 'test-file',
          maxsize: 10240,
          level: 'silly',
          timestamp: true
        }
      }
    });
    defaultFile = logger({
      type: 'file',
      turnOff: true,
      options: {
        file: {
          maxsize: 10240,
          level: 'silly',
          timestamp: true
        }
      }
    });
  });

  afterAll(() => {
    mongo.clear();
  });

  it('Should instanciate the logger', () => {
    info.info('Testing OK for info!', { data: { ok: true } });
    assert(info);
  });

  it('Should instanciate the silent logger', () => {
    silent.error('No log for silent!');
    assert(silent);
  });

  it('Should instanciate the MongoDB logger', () => {
    mongo.error('MongoDB log for MongoDB', { meta: 'ERROR!!!!!!!!!!!!!!'})
    assert(mongo);
  });

  it('Should instanciate the file logger', () => {
    file.error('MongoDB log for file', { meta: 'OK' });
    assert(file);
  });

  it('Should instanciate default logger', () => {
    defaultLogger.error('Testing default.');
    assert(defaultLogger);
  });

  it('Should instanciate string options', () => {
    stringOptionLogger.error('Testing default.');
    assert(stringOptionLogger);
  });

  it('Should instanciate default file', () => {
    defaultFile.error('Testing default.');
    assert(defaultFile);
  });
})