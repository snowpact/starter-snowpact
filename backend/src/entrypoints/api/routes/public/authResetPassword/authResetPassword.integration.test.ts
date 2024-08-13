import { describe, expect, it } from 'vitest';

import { TokenTypeEnum } from '@/domain/entities/token/token.entity.interface';

import { testDbService, app } from '@/configuration/tests/vitest.containers.setup';
import { tokenFactory } from '@/domain/entities/token/token.entity.factory';
import { userFactory } from '@/domain/entities/user/user.factory';

describe('authResetPassword', () => {
  it('should reset the password', async () => {
    const user = userFactory();
    const token = tokenFactory({ tokenType: TokenTypeEnum.resetPassword, userId: user.id });
    const newPassword = 'Password1234*';

    await testDbService.persistUser(user);
    await testDbService.persistToken(token);

    const response = await app.request('/api/public/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token: token.value, password: newPassword }),
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
