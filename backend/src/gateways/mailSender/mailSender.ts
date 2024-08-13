import { inject, injectable } from 'inversify';

import { TYPES } from '@/configuration/di/types';

import {
  MailSenderInterface,
  SendResetPasswordEmailOptions,
} from '../../domain/interfaces/mailSender.interface';
import { MailerInterface } from '../helpers/clientMailer/mailer.interface';

@injectable()
export class MailSender implements MailSenderInterface {
  constructor(@inject(TYPES.Mailer) private mailerService: MailerInterface) {}

  async sendResetPasswordEmail(options: SendResetPasswordEmailOptions): Promise<void> {
    const { email, token } = options;
    const resetPasswordUrl = `https://yourapp.com/reset-password?token=${token}`;
    const html = `<p>To reset your password, click the following link: <a href="${resetPasswordUrl}">Reset Password</a></p>`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password',
      html,
    });
  }
}
