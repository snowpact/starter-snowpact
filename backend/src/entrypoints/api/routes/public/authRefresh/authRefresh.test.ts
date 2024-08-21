import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/configuration/di/mainContainer';
import { HttpCodes } from '@/entrypoints/api/config/httpCode';

import { getRefreshUseCaseMock } from '@/application/useCases/refresh/refresh.useCase.mock';

import { authRefreshRoute } from './';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('authRefreshRoute', () => {
  const refreshUseCaseMock = getRefreshUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(refreshUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return access and refresh tokens on successful refresh', async () => {
    const originalAccessToken = 'original_access_token';
    const originalRefreshToken = 'original_refresh_token';
    const newAccessToken = 'new_access_token';
    const newRefreshToken = 'new_refresh_token';

    refreshUseCaseMock.executeRefresh.mockResolvedValue({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });

    const response = await authRefreshRoute.request('/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: originalAccessToken,
        refreshToken: originalRefreshToken,
      }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
    expect(refreshUseCaseMock.executeRefresh).toHaveBeenCalledWith(
      originalAccessToken,
      originalRefreshToken,
    );
  });

  it.each([
    { message: 'User not found', code: AppErrorCodes.USER_NOT_FOUND },
    { message: 'Invalid JWT token', code: AppErrorCodes.INVALID_JWT_TOKEN },
    { message: 'Refresh token not found', code: AppErrorCodes.TOKEN_NOT_FOUND },
    { message: 'Refresh token expired', code: AppErrorCodes.TOKEN_EXPIRED },
    { message: 'Refresh token type mismatch', code: AppErrorCodes.TOKEN_TYPE_MISMATCH },
    { message: 'Refresh token user id mismatch', code: AppErrorCodes.TOKEN_USER_ID_MISMATCH },
  ])('should return 400 with invalid credentials message when %s', async ({ message, code }) => {
    const originalAccessToken = 'original_access_token';
    const originalRefreshToken = 'original_refresh_token';

    refreshUseCaseMock.executeRefresh.mockRejectedValue(new AppError({ message, code }));

    const response = await authRefreshRoute.request('/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: originalAccessToken,
        refreshToken: originalRefreshToken,
      }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: 'Invalid credentials',
      code: HttpCodes.INVALID_CREDENTIALS,
    });

    expect(refreshUseCaseMock.executeRefresh).toHaveBeenCalledWith(
      originalAccessToken,
      originalRefreshToken,
    );
  });
});
