import { vi } from 'vitest';

import { LoggerServiceInterface } from './logger.service.interface';

export const getLoggerServiceMock = (): LoggerServiceInterface => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});
