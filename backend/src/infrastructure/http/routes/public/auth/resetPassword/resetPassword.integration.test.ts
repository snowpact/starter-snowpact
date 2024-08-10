import { sign } from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';

import { testDbService, app } from '@/tests/vitest.containers.setup';

import { userFactory } from '../../../../../../application/entities/user/user.factory';
import { envConfig } from '../../../../../config/env';

describe('ResetPassword', () => {
  it('should reset the password', async () => {
    const user = userFactory();

    const token = sign(
      { userId: user.id, type: 'reset-password' },
      envConfig.ACCOUNT_TOKEN_SECRET,
      {
        expiresIn: envConfig.ACCOUNT_TOKEN_EXPIRATION,
      },
    );
    const newPassword = 'Password1234*';

    await testDbService.persistUser(user);

    const response = await app.request('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      message: 'Password reset successfully',
      code: 'PASSWORD_RESET_SUCCESSFULLY',
    });

    const updatedUser = await testDbService.getUser(user.id);
    expect(updatedUser).not.toBeNull();
    expect(updatedUser?.password).not.toBe(user.password);
  });
});
