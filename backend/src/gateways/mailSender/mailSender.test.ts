import { describe, it, expect, beforeEach, vi } from 'vitest';

import { MailSender } from './mailSender';
import { getMailerMock } from '../helpers/clientMailer/mailer.mock';

describe('MailSender', () => {
  const mailerServiceMock = getMailerMock();
  const mailSenderService = new MailSender(mailerServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendResetPasswordEmail', () => {
    it('should send a reset password email', async () => {
      const email = 'test@example.com';
      const token = 'test-token';

      await mailSenderService.sendResetPasswordEmail({ email, tokenValue: token });

      expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
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

      expect(mailerServiceMock.sendMail).toHaveBeenCalled();
    });
  });
});
