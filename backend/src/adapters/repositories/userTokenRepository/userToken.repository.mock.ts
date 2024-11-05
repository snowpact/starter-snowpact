import { vi, Mocked } from 'vitest';

import { UserTokenRepositoryInterface } from '../../../domain/interfaces/repositories/userToken.repository.interface';

export const getUserTokenRepositoryMock = (): Mocked<UserTokenRepositoryInterface> => ({
  create: vi.fn().mockResolvedValue(undefined),
  findByTokenValue: vi.fn().mockResolvedValue(undefined),
  deleteByValue: vi.fn().mockResolvedValue(undefined),
  deleteUserTokens: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockResolvedValue(undefined),
  clearExpiredTokens: vi.fn().mockResolvedValue(undefined),
});
