import assert from 'assert';
import createLogger from '../src/index';

describe('Tests logger', () => {
  let info: ReturnType<typeof createLogger>;
  let silent: ReturnType<typeof createLogger>;
  let mongo: ReturnType<typeof createLogger>;
  let file: ReturnType<typeof createLogger>;
  let defaultLogger: ReturnType<typeof createLogger>;
  let stringOptionLogger: ReturnType<typeof createLogger>;
  let defaultFile: ReturnType<typeof createLogger>;

  beforeAll(() => {
    info = createLogger({
      type: 'console',
      options: {
        console: {
          colorize: 'all',
          level: 'silly',
          timestamp: true
        }
      }
    });

    silent = createLogger({
      type: 'console',
      turnOff: true,
      options: {
        console: {}
      }
    });

    mongo = createLogger({
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

    defaultLogger = createLogger();
    stringOptionLogger = createLogger('console');

    file = createLogger({
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

    defaultFile = createLogger({
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
    // close() flushes and shuts down each transport (MongoDB connection, file
    // stream/watcher). --forceExit in the test script handles the MongoDB
    // driver's internal server-selection Timeout which outlives close().
    [mongo, file, info].forEach(l => l.close());
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
    mongo.error('MongoDB log for MongoDB', { meta: 'ERROR!!!!!!!!!!!!!!' });
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
    assert.throws(() => {
      // @ts-expect-error - 'syslog' is not assignable to TransportType
      createLogger({ type: 'syslog', options: {} });
    }, /Unknown transport type: syslog/);
  });

  it('Should throw for null config', () => {
    assert.throws(() => {
      // @ts-expect-error - null is not assignable to LoggerConfig | string
      createLogger(null);
    }, /Invalid config/);
  });

  it('Should throw for a non-string, non-object config', () => {
    assert.throws(() => {
      // @ts-expect-error - number is not assignable to LoggerConfig | string
      createLogger(42);
    }, /Invalid config/);
  });

  it('Should return a silent logger without a MongoDB transport when turnOff is true', () => {
    const silentMongo = createLogger({
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
});
