import { vi } from 'vitest';

import { LoggerInterface } from '../../domain/interfaces/logger.interface';

export const getLoggerMock = (): LoggerInterface => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});
