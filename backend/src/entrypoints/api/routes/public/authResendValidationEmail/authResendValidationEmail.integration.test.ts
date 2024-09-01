import { describe, expect, it } from 'vitest';

import { testDbService, app } from '@/configuration/tests/vitest.containers.setup';
import { userFactory } from '@/domain/entities/user/user.factory';
import { userTokenFactory } from '@/domain/entities/userToken/userToken.entity.factory';

describe('authResendValidationEmail', () => {
  it('should resend the validation email', async () => {
    const user = userFactory({ emailVerified: false });
    const token = userTokenFactory({ userId: user.id });

    await testDbService.persistUser(user);
    await testDbService.persistToken(token);

    const response = await app.request('/api/public/auth/resend-validation-email', {
      method: 'POST',
      body: JSON.stringify({ email: user.email }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      message: 'Validation email resent successfully',
      code: 'EMAIL_RESENT',
    });
  });
});
