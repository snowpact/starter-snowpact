import { inject, injectable } from 'inversify';
import { createTransport } from 'nodemailer';

import { LoggerInterface } from '@/domain/interfaces/logger.interface';

import { envConfig } from '@/configuration/config/env';
import { TYPES } from '@/configuration/di/types';

import { MailerInterface, SendEmailOptions } from './mailer.interface';

@injectable()
export class Mailer implements MailerInterface {
  constructor(@inject(TYPES.Logger) private logger: LoggerInterface) {}

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
    this.logger.debug(`[Mailer] Email sent to ${options.to}`);
  }
}
