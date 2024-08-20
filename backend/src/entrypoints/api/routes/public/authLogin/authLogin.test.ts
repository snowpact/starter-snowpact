import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/configuration/di/mainContainer';

import { getLoginUseCaseMock } from '@/application/useCases/login/login.useCase.mock';

import { authLoginRoute } from './';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('authLoginRoute', () => {
  const loginUseCaseMock = getLoginUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(loginUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return access and refresh tokens on successful login', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const accessToken = 'mock_access_token';
    const refreshToken = 'mock_refresh_token';

    loginUseCaseMock.executeLogin.mockResolvedValue({ accessToken, refreshToken });

    const response = await authLoginRoute.request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ accessToken, refreshToken });
    expect(loginUseCaseMock.executeLogin).toHaveBeenCalledWith(email, password);
  });

  it.each([
    { message: 'User not found', code: AppErrorCodes.USER_NOT_FOUND },
    { message: 'Invalid password', code: AppErrorCodes.BAD_PASSWORD },
  ])('should return 400 with invalid credentials message when %s', async ({ message, code }) => {
    const email = 'nonexistent@example.com';
    const password = 'password123';

    loginUseCaseMock.executeLogin.mockRejectedValue(new AppError({ message, code }));

    const response = await authLoginRoute.request('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      message: 'Invalid credentials',
      code: 'INVALID_CREDENTIALS',
    });
    expect(loginUseCaseMock.executeLogin).toHaveBeenCalledWith(email, password);
  });
});
