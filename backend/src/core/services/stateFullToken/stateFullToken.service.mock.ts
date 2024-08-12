import { vi, Mocked } from 'vitest';

import { StateFullTokenServiceInterface } from './stateFullToken.service.interface';

export const getStateFullTokenServiceMock = (): Mocked<StateFullTokenServiceInterface> => ({
  generateToken: vi.fn().mockResolvedValue(undefined),
  verifyToken: vi.fn().mockResolvedValue(undefined),
  removeToken: vi.fn().mockResolvedValue(undefined),
  refreshToken: vi.fn().mockResolvedValue(undefined),
});
