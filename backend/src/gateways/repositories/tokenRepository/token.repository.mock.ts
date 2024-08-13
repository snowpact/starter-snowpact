import { vi, Mocked } from 'vitest';

import { TokenRepositoryInterface } from '../../../domain/interfaces/repositories/token.repository.interface';

export const getTokenRepositoryMock = (): Mocked<TokenRepositoryInterface> => ({
  create: vi.fn().mockResolvedValue(undefined),
  findByTokenValue: vi.fn().mockResolvedValue(undefined),
  delete: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockResolvedValue(undefined),
});
