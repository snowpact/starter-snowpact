import { describe, it, expect, beforeEach, vi } from 'vitest';

import { MailSender } from './mailSender';
import { getMailerMock } from '../helpers/clientMailer/mailer.mock';

describe('MailSender', () => {
  const mailerServiceMock = getMailerMock();
  const mailSenderService = new MailSender(mailerServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send a reset password email', async () => {
    const email = 'test@example.com';
    const token = 'test-token';

    await mailSenderService.sendResetPasswordEmail({ email, token });

    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      to: email,
      subject: 'Reset Password',
      html: expect.stringContaining('test-token') as string,
    });
  });
});
