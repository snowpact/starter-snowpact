import { Mocked, vi } from 'vitest';

import { MailerServiceInterface } from './mailer.service.interface';

export const getMailerServiceMock = (): Mocked<MailerServiceInterface> => {
  return { sendMail: vi.fn().mockResolvedValue(undefined) };
};
