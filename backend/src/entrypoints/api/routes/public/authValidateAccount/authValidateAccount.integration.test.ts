import { describe, expect, it } from 'vitest';

import { UserTokenTypeEnum } from '@/domain/entities/userToken/userToken.entity.interface';

import { testDbService, app } from '@/configuration/tests/vitest.containers.setup';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

describe('authValidateAccount', () => {
  it('should validate the account', async () => {
    const user = userFactory();
    const token = userTokenFactory({
      tokenType: UserTokenTypeEnum.accountValidation,
      userId: user.id,
    });

    await testDbService.persistUser(user);
    await testDbService.persistToken(token);

    const response = await app.request('/api/public/auth/validate-account', {
      method: 'POST',
      body: JSON.stringify({ token: token.value }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      message: 'Account validated successfully',
      code: 'ACCOUNT_VALIDATED',
    });

    const updatedUser = await testDbService.getUser(user.id);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.emailVerified).toBe(true);
  });
});
