import { vi, Mocked } from 'vitest';

import { AccountTokenServiceInterface } from './accountToken.service.interface';

export const getAccountTokenServiceMock = (): Mocked<AccountTokenServiceInterface> => {
  return {
    generateAccountToken: vi.fn(),
    verifyAccountToken: vi.fn(),
    deleteAccountToken: vi.fn(),
  };
};
