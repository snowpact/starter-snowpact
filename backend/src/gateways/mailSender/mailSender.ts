import { promises } from 'fs';
import { resolve } from 'path';

import handlebars from 'handlebars';
import { inject, injectable } from 'inversify';

import { QueueSenderInterface } from '@/infrastructure/queue/queueSender/queueSender.interface';

import { TYPES } from '@/configuration/di/types';

import {
  MailSenderInterface,
  SendResetPasswordEmailOptions,
} from '../../domain/interfaces/mailSender.interface';

const ENCODING = 'utf8';
const PARTIAL_NAME = 'layout';

const PUBLIC_TEMPLATE_PATH = resolve(__dirname, './templates/base/public.template.hbs');
const INTERNAL_TEMPLATE_PATH = resolve(__dirname, './templates/base/internal.template.hbs');

@injectable()
export class MailSender implements MailSenderInterface {
  constructor(@inject(TYPES.QueueSender) private queueSender: QueueSenderInterface) {}

  private async renderHTMLFromTemplate(
    baseTemplate: 'public' | 'internal',
    subTemplatePath: string,
    params: Record<string, unknown>,
  ): Promise<Promise<string>> {
    const BASE_TEMPLATE_PATH =
      baseTemplate === 'public' ? PUBLIC_TEMPLATE_PATH : INTERNAL_TEMPLATE_PATH;

    const baseSource = await promises.readFile(BASE_TEMPLATE_PATH, ENCODING);
    const templateSource = await promises.readFile(subTemplatePath, ENCODING);

    handlebars.registerPartial(PARTIAL_NAME, templateSource);

    const template = handlebars.compile(baseSource);
    const htmlTemplate = template(params);

    handlebars.unregisterPartial(PARTIAL_NAME);

    return htmlTemplate;
  }

  async sendResetPasswordEmail(options: SendResetPasswordEmailOptions): Promise<void> {
    const { email, tokenValue } = options;

    const subTemplatePath = resolve(__dirname, './templates/partial/resetPassword.template.hbs');
    const html = await this.renderHTMLFromTemplate('public', subTemplatePath, {
      resetPasswordUrl: `https://YOUR_APP.com/reset-password?token=${tokenValue}`,
    });

    await this.queueSender.sendEmail({
      to: email,
      subject: 'Reset Password',
      html,
    });
  }

  async sendRegisterEmail(email: string): Promise<void> {
    const subTemplatePath = resolve(__dirname, './templates/partial/register.template.hbs');
    const html = await this.renderHTMLFromTemplate('public', subTemplatePath, {});

    await this.queueSender.sendEmail({
      to: email,
      subject: 'Reset Password',
      html,
    });
  }
}
