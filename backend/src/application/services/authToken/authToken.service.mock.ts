import { vi, Mocked } from 'vitest';

import { AuthServiceInterface } from './authToken.service.interface';

export const getAuthServiceMock = (): Mocked<AuthServiceInterface> => {
  return {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    verifyAccessToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
  };
};
