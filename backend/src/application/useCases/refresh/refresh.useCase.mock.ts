import { vi, Mocked } from 'vitest';

import { RefreshUseCaseInterface } from './refresh.useCase.interface';

export const getRefreshUseCaseMock = (): Mocked<RefreshUseCaseInterface> => ({
  executeRefresh: vi.fn().mockResolvedValue({
    accessToken: 'mock_new_access_token',
    refreshToken: 'mock_new_refresh_token',
  }),
});
