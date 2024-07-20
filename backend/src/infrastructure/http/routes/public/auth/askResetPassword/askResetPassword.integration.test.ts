import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { SendResetPasswordEmailServiceInterface } from '@/infrastructure/services/mail/sendResetPasswordEmail/sendResetPasswordEmail.service.interface';

import { userFactory } from '@/application/entities/user/user.factory';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';
import { testDbHelper, app } from '@/tests/vitest.containers.setup';

import { getSendResetPasswordEmailServiceMock } from '@/infrastructure/services/mail/sendResetPasswordEmail/sendResetPasswordEmail.service.mock';

describe('AskResetPassword', () => {
  const sendResetPasswordEmailServiceMock = getSendResetPasswordEmailServiceMock();
  mainContainer
    .rebind<SendResetPasswordEmailServiceInterface>(TYPES.SendResetPasswordEmailService)
    .toConstantValue(sendResetPasswordEmailServiceMock);

  it('should send a reset password email', async () => {
    const email = faker.internet.email();
    const user = userFactory({ email });
    await testDbHelper.persistUser(user);

    const response = await app.request('/api/ask-reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      message: 'Email sent',
      code: 'EMAIL_SENT',
    });
    expect(sendResetPasswordEmailServiceMock.sendResetPasswordEmail).toHaveBeenCalledWith({
      email,
      token: expect.any(String) as string,
    });
  });
});
