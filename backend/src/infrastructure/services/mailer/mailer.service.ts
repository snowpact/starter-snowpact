import { inject, injectable } from 'inversify';
import { createTransport } from 'nodemailer';

import { envConfig } from '@/infrastructure/config/env';
import { TYPES } from '@/infrastructure/di/types';

import { MailerServiceInterface, SendEmailOptions } from './mailer.service.interface';
import { LoggerServiceInterface } from '../logger/logger.service.interface';

@injectable()
export class MailerService implements MailerServiceInterface {
  constructor(@inject(TYPES.LoggerService) private loggerService: LoggerServiceInterface) {}

  async sendMail(options: SendEmailOptions): Promise<void> {
    if (!envConfig.EMAIL_SEND) {
      return;
    }

    const transporter = createTransport({
      url: envConfig.SMTP_URL,
    });

    await transporter.sendMail({
      from: envConfig.FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    this.loggerService.debug(`[MailerService] Email sent to ${options.to}`);
  }
}
