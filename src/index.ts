'use strict';

import winston = require('winston');
import winstonMongoDB = require('winston-mongodb');
import DailyRotateFile = require('winston-daily-rotate-file');

const { MongoDB } = winstonMongoDB;

// ── Public types ──────────────────────────────────────────────────────────────

export type TransportType = 'console' | 'mongodb' | 'file';

export interface ConsoleTransportOptions {
  colorize?: string;
  level?: string;
  timestamp?: boolean;
}

export interface FileTransportOptions {
  /** Friendly name used to build the rotated filename: `<name>-%DATE%.log` */
  name?: string;
  filename?: string;
  maxsize?: number;
  level?: string;
  timestamp?: boolean;
}

export interface MongoDBTransportOptions {
  /** MongoDB connection URI, e.g. `mongodb://localhost:27017/mydb` */
  db: string;
  collection?: string;
  level?: string;
  timestamp?: boolean;
}

export interface LoggerOptions {
  console?: ConsoleTransportOptions;
  file?: FileTransportOptions;
  mongodb?: MongoDBTransportOptions;
}

export interface LoggerConfig {
  type: TransportType;
  turnOff?: boolean;
  options: LoggerOptions;
}

// ── Internal constants ────────────────────────────────────────────────────────

const VALID_TYPES: TransportType[] = ['console', 'mongodb', 'file'];

const transports = {
  console: winston.transports.Console,
  mongodb: MongoDB,
  file: DailyRotateFile,
};

winston.addColors({
  error: 'red',
  debug: 'yellow',
  info: 'blue',
  silly: 'green',
});

// ── Factory ───────────────────────────────────────────────────────────────────

function createLogger(config?: LoggerConfig | string): winston.Logger {
  if (
    config !== undefined &&
    (config === null || (typeof config !== 'string' && typeof config !== 'object'))
  ) {
    throw new Error('Invalid config: expected an object or string');
  }

  const configuration: LoggerConfig =
    typeof config === 'object'
      ? (config as LoggerConfig)
      : {
          turnOff: false,
          type: typeof config === 'string' ? (config as TransportType) : 'console',
          options: {
            console: { colorize: 'all', level: 'silly', timestamp: true },
            file: { filename: 'logs', maxsize: 10240, level: 'error', timestamp: true },
            mongodb: {
              db: 'mongodb://localhost:27017/logger',
              collection: 'logs',
              level: 'error',
              timestamp: true,
            },
          },
        };

  const type: TransportType = configuration.type || 'console';

  if (!VALID_TYPES.includes(type)) {
    throw new Error(`Unknown transport type: ${type}`);
  }

  if (configuration.turnOff) {
    return winston.createLogger({ silent: true });
  }

  if (type === 'file' && configuration.options.file) {
    const fileOpts = configuration.options.file;
    fileOpts.filename = `${fileOpts.name || 'logs'}-%DATE%.log`;
    (fileOpts as DailyRotateFile.DailyRotateFileTransportOptions).handleExceptions = true;
    (fileOpts as DailyRotateFile.DailyRotateFileTransportOptions).datePattern = 'YYYY-MM-DD';
  }

  const Transport = transports[type];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return winston.createLogger({
    transports: [new (Transport as any)(configuration.options[type])],
    silent: false,
  });
}

export default createLogger;
