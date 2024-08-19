import { Mocked, vi } from 'vitest';

import { MailSenderInterface } from '../../domain/interfaces/mailSender.interface';

export const getMailSenderMock = (): Mocked<MailSenderInterface> => {
  return {
    sendResetPasswordEmail: vi.fn(),
  };
};
