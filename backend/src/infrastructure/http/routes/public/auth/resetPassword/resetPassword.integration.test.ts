import { describe, expect, it } from 'vitest';

import { TokenTypeEnum } from '@/infrastructure/services/stateFullToken/token/token.interface';

import { tokenFactory } from '@/infrastructure/services/stateFullToken/token/token.factory';
import { testDbHelper, app } from '@/tests/vitest.containers.setup';

import { userFactory } from '../../../../../../application/entities/user/user.factory';

describe('ResetPassword', () => {
  it('should reset the password', async () => {
    const user = userFactory();
    const token = tokenFactory({ tokenType: TokenTypeEnum.resetPassword, userId: user.id });
    const newPassword = 'Password1234*';

    await testDbHelper.persistUser(user);
    await testDbHelper.persistToken(token);

    const response = await app.request('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: token.value, password: newPassword }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      message: 'Password reset successfully',
      code: 'PASSWORD_RESET_SUCCESSFULLY',
    });

    const updatedUser = await testDbHelper.getUser(user.id);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.password).not.toBe(user.password);
  });
});
