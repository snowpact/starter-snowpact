import { createTransport } from 'nodemailer';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { envConfig } from '@/infrastructure/config/env';

import { getLoggerServiceMock } from '@/gateways/logger/logger.service.mock';

import { MailerService } from './mailer.service';

vi.mock('nodemailer', () => ({
  createTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('MailerService', () => {
  const loggerService = getLoggerServiceMock();
  const mailerService = new MailerService(loggerService);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not send an email if EMAIL_SEND is false', async () => {
    envConfig.EMAIL_SEND = false;

    await mailerService.sendMail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    });

    expect(createTransport).not.toHaveBeenCalled();
  });

  it('should send an email if EMAIL_SEND is true', async () => {
    envConfig.EMAIL_SEND = true;
    envConfig.SMTP_URL = 'smtp://test';
    envConfig.FROM_EMAIL = 'from@example.com';

    await mailerService.sendMail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    });

    expect(createTransport).toHaveBeenCalledWith({
      url: envConfig.SMTP_URL,
    });
    expect(createTransport().sendMail).toHaveBeenCalledWith({
      from: envConfig.FROM_EMAIL,
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    });
    expect(loggerService.debug).toHaveBeenCalledWith(
      '[MailerService] Email sent to test@example.com',
    );
  });
});
