import { vi, Mocked } from 'vitest';

import { UserTokenRepositoryInterface } from '../../../domain/interfaces/repositories/userToken.repository.interface';

export const getUserTokenRepositoryMock = (): Mocked<UserTokenRepositoryInterface> => ({
  create: vi.fn().mockResolvedValue(undefined),
  findByTokenValue: vi.fn().mockResolvedValue(undefined),
  delete: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockResolvedValue(undefined),
});
