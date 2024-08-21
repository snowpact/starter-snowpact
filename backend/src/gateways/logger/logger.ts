import { injectable } from 'inversify';
import pino from 'pino';

import { asyncLocalStorage } from '@/entrypoints/api/middlewares/requestId/requestId.middleware';

import { LoggerInterface } from '../../domain/interfaces/logger.interface';
import { EnvConfig } from '../envConfig/envConfig';

@injectable()
export class Logger implements LoggerInterface {
  private logger: pino.Logger;

  constructor() {
    const envConfig = new EnvConfig();
    this.logger = pino({
      level: envConfig.logLevel,
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

  error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    this.logger.error(
      {
        ...context,
        err: error instanceof Error ? error : new Error('Unknown error'),
        requestId: this.getRequestId(),
      },
      message,
      error,
    );
  }
}
