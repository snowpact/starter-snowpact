import { inject, injectable } from 'inversify';

import { TYPES } from '@/infrastructure/di/types';

import {
  SendResetPasswordEmailServiceInterface,
  SendResetPasswordEmailOptions,
} from './sendResetPasswordEmail.service.interface';
import { MailerServiceInterface } from '../../clientMailer/mailer.service.interface';

@injectable()
export class SendResetPasswordEmailService implements SendResetPasswordEmailServiceInterface {
  constructor(@inject(TYPES.MailerService) private mailerService: MailerServiceInterface) {}

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
