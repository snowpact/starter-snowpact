import { vi, Mocked } from 'vitest';

import { UserTokenServiceInterface } from './userToken.service.interface';

export const getUserTokenServiceMock = (): Mocked<UserTokenServiceInterface> => ({
  generateToken: vi.fn().mockResolvedValue(undefined),
  verifyToken: vi.fn().mockResolvedValue(undefined),
});
