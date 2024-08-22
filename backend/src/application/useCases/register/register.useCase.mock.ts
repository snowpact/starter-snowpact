import { Mocked, vi } from 'vitest';

import { RegisterUseCaseInterface } from './register.useCase.interface';

export const getRegisterUseCaseMock = (): Mocked<RegisterUseCaseInterface> => ({
  executeRegister: vi.fn().mockResolvedValue(undefined),
});
