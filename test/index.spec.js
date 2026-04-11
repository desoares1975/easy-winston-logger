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

  it('Should throw for an unknown transport type', () => {
    assert.throws(
      () => logger({ type: 'syslog', options: { syslog: {} } }),
      /Unknown transport type: syslog/
    );
  });

  it('Should throw for null config', () => {
    assert.throws(
      () => logger(null),
      /Invalid config/
    );
  });

  it('Should throw for a non-string, non-object config', () => {
    assert.throws(
      () => logger(42),
      /Invalid config/
    );
  });

  it('Should return a silent logger without a MongoDB transport when turnOff is true', () => {
    const silentMongo = logger({
      type: 'mongodb',
      turnOff: true,
      options: {
        mongodb: {
          db: 'mongodb://localhost:27017/test',
          collection: 'logs',
          level: 'error'
        }
      }
    });
    assert(silentMongo);
    assert.strictEqual(silentMongo.silent, true);
    const hasMongoTransport = silentMongo.transports.some(t => t.constructor.name === 'MongoDB');
    assert.strictEqual(hasMongoTransport, false);
  });
})