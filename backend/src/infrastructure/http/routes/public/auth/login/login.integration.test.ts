/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { userFactory } from '@/application/entities/user/user.factory';
import { testDbService, app } from '@/tests/vitest.containers.setup';

describe('Login', () => {
  it('should login a user', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    const user = userFactory({ email, password });
    await testDbService.persistUser(user);

    const response = await app.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
