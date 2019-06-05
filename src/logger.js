// @flow

import winston from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');


const generalRotateTransport = new (DailyRotateFile)({
  level: 'info',
  filename: 'logs/general-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
const errorRotateTransport = new (DailyRotateFile)({
  level: 'error',
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
const debugRotateTransport = new (DailyRotateFile)({
  level: 'debug',
  filename: 'logs/debug-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
const exceptionRotateTransport = new (DailyRotateFile)({
  filename: 'logs/exception-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});

generalRotateTransport.on('rotate', function(oldFilename, newFilename) {
});


export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    debugRotateTransport,
    errorRotateTransport,
    generalRotateTransport
  ],
  exceptionHandlers: [
    exceptionRotateTransport
  ],
  exitOnError: false
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
