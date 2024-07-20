import { Mocked, vi } from 'vitest';

import { PasswordServiceInterface } from './password.service.interface';

export const getPasswordServiceMock = (): Mocked<PasswordServiceInterface> => {
  return {
    hashPassword: vi.fn(),
    comparePassword: vi.fn(),
    checkPasswordComplexity: vi.fn(),
  };
};
