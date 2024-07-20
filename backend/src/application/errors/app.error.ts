import { AppErrorCodes, AppErrorInterface, AppErrorOptions } from './app.error.interface';

export class AppError extends Error implements AppErrorInterface {
  public message: string;
  public code: AppErrorCodes;
  public context?: unknown;
  public isAppError = true;

  constructor({ code, message, context }: AppErrorOptions) {
    super(message);
    this.message = message;
    this.context = context;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
    // Error.captureStackTrace(this);
  }
}
