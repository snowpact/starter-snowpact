import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Logger } from './logger';

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
  });

  describe('debug', () => {
    it('should log a debug message', () => {
      const message = 'debug message';
      const context = { userId: '123' };
      const spy = vi.spyOn(logger['logger'], 'debug');

      logger.debug(message, context);

      expect(spy).toHaveBeenCalledWith(context, message);
    });
  });

  describe('info', () => {
    it('should log an info message', () => {
      const message = 'info message';
      const context = { userId: '123' };
      const spy = vi.spyOn(logger['logger'], 'info');

      logger.info(message, context);

      expect(spy).toHaveBeenCalledWith(context, message);
    });
  });

  describe('warn', () => {
    it('should log a warn message', () => {
      const message = 'warn message';
      const context = { userId: '123' };
      const spy = vi.spyOn(logger['logger'], 'warn');

      logger.warn(message, context);

      expect(spy).toHaveBeenCalledWith(context, message);
    });
  });

  describe('error', () => {
    it('should log an error message', () => {
      const message = 'error message';
      const error = new Error('error');
      const context = { userId: '123' };
      const spy = vi.spyOn(logger['logger'], 'error');

      logger.error(message, error, context);

      expect(spy).toHaveBeenCalledWith({ ...context, err: error }, message);
    });
  });
});
