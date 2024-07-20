import { injectable } from 'inversify';
import pino from 'pino';

import { envConfig } from '@/infrastructure/config/env';
import { asyncLocalStorage } from '@/infrastructure/http/middlewares/requestId.middleware';

import { LoggerServiceInterface } from './logger.service.interface';

@injectable()
export class LoggerService implements LoggerServiceInterface {
  private logger: pino.Logger;

  constructor() {
    this.logger = pino({
      level: envConfig.LOG_LEVEL,
      transport:
        process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    });
  }

  private getRequestId(): string | undefined {
    return asyncLocalStorage.getStore()?.requestId;
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug({ ...context, requestId: this.getRequestId() }, message);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.logger.info({ ...context, requestId: this.getRequestId() }, message);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn({ ...context, requestId: this.getRequestId() }, message);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.logger.error({ ...context, err: error, requestId: this.getRequestId() }, message);
  }
}
