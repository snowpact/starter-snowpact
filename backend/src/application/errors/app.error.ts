import { appLogger } from '@/configuration/logger/logger.singleton';

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
    appLogger.debug(message, { context, privateContext });
    // Error.captureStackTrace(this);
  }
}
