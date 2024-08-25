import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getQueueSenderMock } from '@/infrastructure/queue/queueSender/queueSender.mock';

import { MailSender } from './mailSender';

describe('MailSender', () => {
  const queueSenderMock = getQueueSenderMock();
  const mailSenderService = new MailSender(queueSenderMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendResetPasswordEmail', () => {
    it('should send a reset password email', async () => {
      const email = 'test@example.com';
      const token = 'test-token';

      await mailSenderService.sendResetPasswordEmail({ email, tokenValue: token });

      expect(queueSenderMock.sendEmail).toHaveBeenCalledWith({
        to: email,
        subject: 'Reset Password',
        html: expect.stringContaining('test-token') as string,
      });
    });
  });

  describe('sendRegisterEmail', () => {
    it('should send a register email', async () => {
      const email = 'test@example.com';

      await mailSenderService.sendRegisterEmail(email);

      expect(queueSenderMock.sendEmail).toHaveBeenCalled();
    });
  });
});
