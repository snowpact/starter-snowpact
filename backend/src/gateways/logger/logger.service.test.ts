import { describe, it, expect, beforeEach, vi } from 'vitest';

import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  let loggerService: LoggerService;

  beforeEach(() => {
    loggerService = new LoggerService();
  });

  describe('debug', () => {
    it('should log a debug message', () => {
      const message = 'debug message';
      const context = { userId: '123' };
      const spy = vi.spyOn(loggerService['logger'], 'debug');

      loggerService.debug(message, context);

      expect(spy).toHaveBeenCalledWith(context, message);
    });
  });

  describe('info', () => {
    it('should log an info message', () => {
      const message = 'info message';
      const context = { userId: '123' };
      const spy = vi.spyOn(loggerService['logger'], 'info');

      loggerService.info(message, context);

      expect(spy).toHaveBeenCalledWith(context, message);
    });
  });

  describe('warn', () => {
    it('should log a warn message', () => {
      const message = 'warn message';
      const context = { userId: '123' };
      const spy = vi.spyOn(loggerService['logger'], 'warn');

      loggerService.warn(message, context);

      expect(spy).toHaveBeenCalledWith(context, message);
    });
  });

  describe('error', () => {
    it('should log an error message', () => {
      const message = 'error message';
      const error = new Error('error');
      const context = { userId: '123' };
      const spy = vi.spyOn(loggerService['logger'], 'error');

      loggerService.error(message, error, context);

      expect(spy).toHaveBeenCalledWith({ ...context, err: error }, message);
    });
  });
});
