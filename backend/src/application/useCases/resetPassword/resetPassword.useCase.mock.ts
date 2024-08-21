import { vi, Mocked } from 'vitest';

import { ResetPasswordUseCaseInterface } from './resetPassword.useCase.interface';

export const getResetPasswordUseCaseMock = (): Mocked<ResetPasswordUseCaseInterface> => ({
  executeResetPasswordRequest: vi.fn().mockResolvedValue(undefined),
  executeResetPassword: vi.fn().mockResolvedValue(undefined),
});
