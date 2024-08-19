import { inject, injectable } from 'inversify';
import { createTransport } from 'nodemailer';

import { EnvConfigInterface } from '@/domain/interfaces/envConfig.interface';
import { LoggerInterface } from '@/domain/interfaces/logger.interface';

import { TYPES } from '@/configuration/di/types';

import { MailerInterface, SendEmailOptions } from './mailer.interface';

@injectable()
export class Mailer implements MailerInterface {
  constructor(
    @inject(TYPES.Logger) private logger: LoggerInterface,
    @inject(TYPES.EnvConfig) private envConfig: EnvConfigInterface,
  ) {}

  async sendMail(options: SendEmailOptions): Promise<void> {
    if (!this.envConfig.emailSend) {
      return;
    }

    const transporter = createTransport({
      url: this.envConfig.smtpUrl,
    });

    await transporter.sendMail({
      from: this.envConfig.fromEmail,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    this.logger.debug(`[Mailer] Email sent to ${options.to}`);
  }
}
