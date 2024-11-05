import { Logger } from '@/adapters/logger/logger';

import { AppErrorCodes, AppErrorInterface, AppErrorOptions } from './app.error.interface';

export class AppError extends Error implements AppErrorInterface {
  public message: string;
  public code: AppErrorCodes;
  public context?: unknown;
  public cause?: unknown;
  public privateContext?: unknown;
  public isAppError = true;
  public error = Error;

  constructor({ code, message, context, privateContext, error, silent = false }: AppErrorOptions) {
    const cause = error instanceof Error ? error.cause : undefined;

    super(message, { cause });
    this.message = message;
    this.context = context;
    this.code = code;
    this.cause = cause;

    Object.setPrototypeOf(this, new.target.prototype);

    if (!silent) {
      const appLogger = new Logger();
      appLogger.debug(message, { context, privateContext });
    }
    // Error.captureStackTrace(this);
  }
}
