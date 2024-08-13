import { Mocked, vi } from 'vitest';

import { MailerInterface } from './mailer.interface';

export const getMailerMock = (): Mocked<MailerInterface> => {
  return { sendMail: vi.fn().mockResolvedValue(undefined) };
};
