# README #

### Setup ###
```bash
npm install --save git@bitbucket.org:fabio_blendimob/mobi-logger.git
```
### Usage ###
```js
let config = {
    'type': 'console',
    'options': {
      'mongodb': {
        'db': 'mongodb://localhost:27017/mobiserver',
        'collection': 'logs',
        'level': process.env.LOG_LEVEL || 'error',
        'timestamp': true
      },
      'file': {
        'filename': 'logs.txt',
        'level': process.env.LOG_LEVEL || 'error',
        'timestamp': true
      },
      'console': {
        'colorize': 'all',
        'level': process.env.LOG_LEVEL || 'info',
        'timestamp': true
      }
    }
  };

let logger = require('mobi-logger')(config);
// or
let logger = require('mobi-logger')('mongodb');// options may be console, mongodb or file

logger.info('This is an info');
logger.debug('This is a debug');
logger.error('This is an error');

```