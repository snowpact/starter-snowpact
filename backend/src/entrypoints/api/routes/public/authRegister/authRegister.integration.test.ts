/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { app, testDbService } from '@/configuration/tests/vitest.containers.setup';

import { getMailSenderMock } from '@/gateways/mailSender/mailSender.mock';

describe('authRegister', () => {
  const mailSenderMock = getMailSenderMock();
  mainContainer.rebind<MailSenderInterface>(TYPES.MailSender).toConstantValue(mailSenderMock);

  it('should register a user', async () => {
    const email = faker.internet.email().toLocaleLowerCase();
    const password = 'Password78*';

    const response = await app.request('/api/public/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(mailSenderMock.sendRegisterEmail).toHaveBeenCalledWith({
      email,
      tokenValue: expect.any(String),
    });

    const dbUser = await testDbService.getUserByEmail(email);
    expect(dbUser).toBeDefined();
    expect(dbUser?.email).toBe(email);
  });
});
