import { describe, it, expect, beforeEach, vi } from 'vitest';

import { getMailerServiceMock } from '@/infrastructure/services/mailer/mailer.service.mock';

import { SendResetPasswordEmailService } from './sendResetPasswordEmail.service';

describe('SendResetPasswordEmailService', () => {
  const mailerServiceMock = getMailerServiceMock();
  const sendResetPasswordEmailService = new SendResetPasswordEmailService(mailerServiceMock);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send a reset password email', async () => {
    const email = 'test@example.com';
    const token = 'test-token';

    await sendResetPasswordEmailService.sendResetPasswordEmail({ email, token });

    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
      to: email,
      subject: 'Reset Password',
      html: expect.stringContaining('test-token') as string,
    });
  });
});
