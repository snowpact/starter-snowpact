import { vi, Mocked } from 'vitest';

import { ResendValidationEmailUseCaseInterface } from './resendValidationEmail.useCase.interface';

export const getResendValidationEmailUseCaseMock =
  (): Mocked<ResendValidationEmailUseCaseInterface> => ({
    executeResendValidationEmail: vi.fn().mockResolvedValue(undefined),
  });
