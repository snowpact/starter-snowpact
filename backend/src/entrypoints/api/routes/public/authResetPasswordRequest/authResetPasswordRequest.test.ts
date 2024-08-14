import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/configuration/di/mainContainer';

import { getResetPasswordUseCaseMock } from '@/application/useCases/resetPassword/resetPassword.useCase.mock';

import { authResetPasswordRequestRoute } from './index';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('authResetPasswordRequestRoute', () => {
  const resetPasswordUseCaseMock = getResetPasswordUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(resetPasswordUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should send a reset password email successfully', async () => {
    const email = 'test@example.com';

    const response = await authResetPasswordRequestRoute.request('/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Email sent', code: 'EMAIL_SENT' });
    expect(resetPasswordUseCaseMock.executeAskResetPassword).toHaveBeenCalledWith(email);
  });

  it('should return 200 even if user is not found', async () => {
    const email = 'nonexistent@example.com';

    resetPasswordUseCaseMock.executeAskResetPassword.mockRejectedValue(
      new AppError({ message: 'User not found', code: AppErrorCodes.USER_NOT_FOUND }),
    );

    const response = await authResetPasswordRequestRoute.request('/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Email sent', code: 'EMAIL_SENT' });
    expect(resetPasswordUseCaseMock.executeAskResetPassword).toHaveBeenCalledWith(email);
  });

  it('should return 200 even if email sending fails', async () => {
    const email = 'test@example.com';

    resetPasswordUseCaseMock.executeAskResetPassword.mockRejectedValue(
      new AppError({ message: 'Failed to send email', code: AppErrorCodes.FAILED_TO_SEND_EMAIL }),
    );

    const response = await authResetPasswordRequestRoute.request('/reset-password-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'Email sent', code: 'EMAIL_SENT' });
    expect(resetPasswordUseCaseMock.executeAskResetPassword).toHaveBeenCalledWith(email);
  });
});
