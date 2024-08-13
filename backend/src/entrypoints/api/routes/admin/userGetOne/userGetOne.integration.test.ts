import { describe, expect, it } from 'vitest';

import { generateAccessToken } from '@/configuration/tests/helpers/auth/auth.helper';
import { testDbService, app } from '@/configuration/tests/vitest.containers.setup';
import { userFactory } from '@/domain/entities/user/user.factory';

describe('Get user', () => {
  it('should get a user', async () => {
    const user = userFactory();
    await testDbService.persistUser(user);
    const token = await generateAccessToken({ userId: user.id });

    const response = await app.request(`/api/admin/user/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    expect(response.status).toBe(200);
  });
});
