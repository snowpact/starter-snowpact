import { describe, expect, it } from 'vitest';

import { userFactory } from '@/application/entities/user/user.factory';
import { generateAccessToken } from '@/tests/helpers/auth/auth.helper';
import { testDbHelper, app } from '@/tests/vitest.containers.setup';

describe('Get user', () => {
  it('should get a user', async () => {
    const user = userFactory();
    await testDbHelper.persistUser(user);
    const token = await generateAccessToken({ userId: user.id });

    const response = await app.request(`/api/admin/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status).toBe(200);
  });
});
