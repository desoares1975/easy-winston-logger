# README #

### Setup ###
```bash
npm install --save git+ssh://git@bitbucket.org/blendmobi/mobilogger.git
```
### Usage ###
```js
let config = {
    'turnOff': false,
    'type': 'file',
    //you may have only the used option, in this case file
    'options': {
      'mongodb': {
        'db': 'mongodb://localhost:27017/mobiserver',
        'collection': 'logs',
        'level': process.env.LOG_LEVEL || 'error',
        'timestamp': true
      },
      'file': {
        'filename': 'logs',
        'maxsize': 10240,
        'level': 'silly',
        'timestamp': true
      },
      'console': {
        'colorize': 'all',
        'level': 'debug',
        'timestamp': true
      }
    }
  };

let logger = require('mobilogger')(config);
// or
let logger = require('mobilogger')('mongodb');// options may be console, mongodb or file

logger.info('This is an info');
logger.debug('This is a debug');
logger.error('This is an error');

```