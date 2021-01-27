const assert = require('assert');
const logger = require('../index.js');

const info = logger({
  type: 'console',
  options: {
    console: {
      colorize: 'all',
      level: 'silly',
      timestamp: true
    }
  }
});
const silent = logger({
  type: 'console',
  turnOff: true,
  options: {
    console: {}
  }
});

const mongo = logger({
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

const file = logger({
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
})

describe('Tests logger', () => {
  it('Should instanciate the logger', () => {
    info.info('Testing OK for info!', { data: { ok: true } })
    assert(info);
  })

  it('Should instanciate the silent logger', () => {
    silent.error('No log for silent!')
    assert(silent);
  })

  it('Should instanciate the MongoDB logger', () => {
    mongo.error('MongoDB log for MongoDB', { meta: 'ERROR!!!!!!!!!!!!!!'})
    assert(mongo);
  })

  it('Should instanciate the file logger', () => {
    file.error('MongoDB log for file', { meta: 'OK' })
    assert(file);
  })
})