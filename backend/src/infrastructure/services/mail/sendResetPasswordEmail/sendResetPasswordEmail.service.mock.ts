import { Mocked, vi } from 'vitest';

import { SendResetPasswordEmailServiceInterface } from './sendResetPasswordEmail.service.interface';

export const getSendResetPasswordEmailServiceMock =
  (): Mocked<SendResetPasswordEmailServiceInterface> => {
    return { sendResetPasswordEmail: vi.fn() };
  };
