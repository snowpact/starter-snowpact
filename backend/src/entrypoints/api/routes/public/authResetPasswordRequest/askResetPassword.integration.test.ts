import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { testDbService, app } from '@/configuration/tests/vitest.containers.setup';
import { userFactory } from '@/domain/entities/user/user.factory';

import { getMailSenderMock } from '@/gateways/mailSender/mailSender.mock';

describe('authResetPasswordRequest', () => {
  const mailSenderMock = getMailSenderMock();
  mainContainer.rebind<MailSenderInterface>(TYPES.MailSender).toConstantValue(mailSenderMock);

  it('should send a reset password email', async () => {
    const email = faker.internet.email();
    const user = userFactory({ email });
    await testDbService.persistUser(user);

    const response = await app.request('/api/public/auth/reset-password-request', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      message: 'Email sent',
      code: 'EMAIL_SENT',
    });
    expect(mailSenderMock.sendResetPasswordEmail).toHaveBeenCalledWith({
      email,
      token: expect.any(String) as string,
    });
  });
});
