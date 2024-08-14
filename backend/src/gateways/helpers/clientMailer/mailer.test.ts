import { createTransport } from 'nodemailer';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { envConfig } from '@/configuration/env/envConfig';

import { getLoggerMock } from '@/gateways/logger/logger.mock';

import { Mailer } from './mailer';

vi.mock('nodemailer', () => ({
  createTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('Mailer', () => {
  const logger = getLoggerMock();
  const mailer = new Mailer(logger);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not send an email if EMAIL_SEND is false', async () => {
    envConfig.EMAIL_SEND = false;

    await mailer.sendMail({
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

    await mailer.sendMail({
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
    expect(logger.debug).toHaveBeenCalledWith('[Mailer] Email sent to test@example.com');
  });
});
