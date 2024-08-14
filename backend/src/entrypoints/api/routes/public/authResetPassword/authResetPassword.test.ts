import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { mainContainer } from '@/configuration/di/mainContainer';

import { getResetPasswordUseCaseMock } from '@/application/useCases/resetPassword/resetPassword.useCase.mock';

import { authResetPasswordRoute } from './index';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('authResetPasswordRoute', () => {
  const resetPasswordUseCaseMock = getResetPasswordUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(resetPasswordUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should reset password successfully', async () => {
    const token = 'valid_token';
    const password = 'newPassword123!';

    resetPasswordUseCaseMock.executeResetPassword.mockResolvedValue(undefined);

    const response = await authResetPasswordRoute.request('/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: 'Password reset successfully',
      code: 'PASSWORD_RESET_SUCCESSFULLY',
    });
    expect(resetPasswordUseCaseMock.executeResetPassword).toHaveBeenCalledWith(token, password);
  });
});
