import { vi, Mocked } from 'vitest';

import { LoginUseCaseInterface } from './login.useCase.interface';

export const getLoginUseCaseMock = (): Mocked<LoginUseCaseInterface> => ({
  executeLogin: vi.fn().mockResolvedValue({
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token',
  }),
});
