/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, expect, it } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { generateAccessToken } from '@/configuration/tests/helpers/auth/auth.helper';
import { testDbService, app } from '@/configuration/tests/vitest.containers.setup';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

describe('authRefresh', () => {
  it('should refresh all tokens', async () => {
    const user = userFactory();
    const accessToken = await generateAccessToken({ userId: user.id, expiresIn: -1 });
    const userToken = userTokenFactory({
      userId: user.id,
      tokenType: UserTokenTypeEnum.refreshToken,
      canBeRefreshed: true,
    });

    await testDbService.persistUser(user);
    await testDbService.persistToken(userToken);

    const response = await app.request('/api/public/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ accessToken, refreshToken: userToken.value }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
