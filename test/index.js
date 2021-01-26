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
    console: {
      colorize: 'all',
        level: 'silly',
        timestamp: true
    }
  }
});

describe('Tests logger', () => {
  it('Should instanciante the logger', () => {
    info.info('OK for info!')
    assert(info);
  })
  it('Should instanciante the logger', () => {
    silent.info('OK for silent!')
    assert(info);
  })
})