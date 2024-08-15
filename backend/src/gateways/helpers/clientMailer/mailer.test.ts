import { createTransport } from 'nodemailer';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getEnvConfigMock } from '@/gateways/envConfig/envConfig.mock';
import { getLoggerMock } from '@/gateways/logger/logger.mock';

import { Mailer } from './mailer';

vi.mock('nodemailer', () => ({
  createTransport: vi.fn().mockReturnValue({
    sendMail: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('Mailer', () => {
  const logger = getLoggerMock();
  const envConfig = getEnvConfigMock();
  const mailer = new Mailer(logger, envConfig);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not send an email if EMAIL_SEND is false', async () => {
    envConfig.emailSend = false;

    await mailer.sendMail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    });

    expect(createTransport).not.toHaveBeenCalled();
  });

  it('should send an email if EMAIL_SEND is true', async () => {
    envConfig.emailSend = true;
    envConfig.smtpUrl = 'smtp://test';
    envConfig.fromEmail = 'from@example.com';

    await mailer.sendMail({
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    });

    expect(createTransport).toHaveBeenCalledWith({
      url: envConfig.smtpUrl,
    });
    expect(createTransport().sendMail).toHaveBeenCalledWith({
      from: envConfig.fromEmail,
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<p>Test Email</p>',
    });
    expect(logger.debug).toHaveBeenCalledWith('[Mailer] Email sent to test@example.com');
  });
});
