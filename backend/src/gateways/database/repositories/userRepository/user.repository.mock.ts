import { vi, Mocked } from 'vitest';

import { UserRepositoryInterface } from './user.repository.interface';

export const getUserRepositoryMock = (): Mocked<UserRepositoryInterface> => ({
  findByEmail: vi.fn().mockResolvedValue(undefined),
  findById: vi.fn().mockResolvedValue(undefined),
  updateOne: vi.fn().mockResolvedValue(undefined),
});