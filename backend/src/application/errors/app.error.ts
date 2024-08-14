import { Logger } from '@/gateways/logger/logger';

import { AppErrorCodes, AppErrorInterface, AppErrorOptions } from './app.error.interface';

export class AppError extends Error implements AppErrorInterface {
  public message: string;
  public code: AppErrorCodes;
  public context?: unknown;
  public privateContext?: unknown;
  public isAppError = true;

  constructor({ code, message, context, privateContext }: AppErrorOptions) {
    super(message);
    this.message = message;
    this.context = context;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    const logger = new Logger();
    logger.debug(message, { context, privateContext });
    // Error.captureStackTrace(this);
  }
}
