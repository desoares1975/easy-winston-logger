# Easy Winston Logger

### Setup ###
```bash
npm install --save easy-winston-logger
```

### Usage ###

```js
let config = {
    turnOff: false,
    type: 'file',
    //you may have only the used option, in this case file
    options: {
      mongodb: {
        db: 'mongodb://localhost:27017/logs',
        collection: 'logs',
        level: process.env.LOG_LEVEL || 'error',
        timestamp: true
      },
      file: {
        name: 'filename',
        maxsize: 10240,
        level: 'silly',
        timestamp: true
      },
      console: {
        colorize: 'all',
        level: 'debug',
        timestamp: true
      }
    }
  };

let logger = require('easy-winston-logger')(config);
// or
let logger = require('easy-winston-logger')('mongodb');// options may be console, mongodb or file

logger.info('This is an info');
logger.debug('This is a debug');
logger.error('This is an error');

```