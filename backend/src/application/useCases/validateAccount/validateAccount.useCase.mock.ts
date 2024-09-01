import { Mocked, vi } from 'vitest';

import { ValidateAccountUseCaseInterface } from './validateAccount.useCase.interface';

export const getValidateAccountUseCaseMock = (): Mocked<ValidateAccountUseCaseInterface> => ({
  executeValidateAccount: vi.fn().mockResolvedValue(undefined),
});
