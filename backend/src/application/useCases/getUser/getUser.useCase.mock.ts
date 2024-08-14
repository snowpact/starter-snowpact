import { vi, Mocked } from 'vitest';

import { GetUserUseCaseInterface } from './getUser.useCase.interface';

export const getUserUseCaseMock = (): Mocked<GetUserUseCaseInterface> => ({
  executeGetUser: vi.fn().mockResolvedValue({
    id: 'mock_user_id',
    email: 'mock_user@example.com',
    admin: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
});
