const winston = require('winston');

const logLevel = process.env.LOG_LEVEL || 'info';
const nodeEnv = process.env.NODE_ENV || 'development';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      service,
      message,
      ...meta,
    });
  })
);

const createLogger = (serviceName: string) => {
  return winston.createLogger({
    level: logLevel,
    format: logFormat,
    defaultMeta: { service: serviceName, environment: nodeEnv },
    transports: [
      new winston.transports.Console({
        format: nodeEnv === 'development' 
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          : logFormat,
      }),
      new winston.transports.File({
        filename: `logs/${serviceName}-error.log`,
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: `logs/${serviceName}-combined.log`,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
      }),
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: `logs/${serviceName}-exceptions.log` }),
    ],
    rejectionHandlers: [
      new winston.transports.File({ filename: `logs/${serviceName}-rejections.log` }),
    ],
  });
};

export { createLogger };
export default createLogger;