import log from 'loglevel';

export const logger = {
  log(...args: any): void {
    this.debug(args);
  },

  info(...args: any): void {
    log.info(args);
  },

  debug(...args: any): void {
    if (process.env.NODE_ENV === 'development') {
      args.forEach((err) => log.debug(err));
    }
  },

  warn(...args: any): void {
    log.warn(args);
  },

  error(...args: any): void {
    log.error(args);
  },

  derror(...args: any): void {
    if (process.env.NODE_ENV === 'development') {
      args.forEach((err) => {
        if (err instanceof Error) {
          log.error(err.message);
        } else log.error(err);
      });
    }
  },
};
