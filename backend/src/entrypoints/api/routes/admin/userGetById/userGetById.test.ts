import { faker } from '@faker-js/faker';
import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/configuration/di/mainContainer';
import { userFactory } from '@/domain/entities/user/user.factory';
import { HttpCodes } from '@/entrypoints/api/config/httpCode';

import { getUserUseCaseMock } from '@/application/useCases/getUser/getUser.useCase.mock';

import { userGetByIdRoute } from './index';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('userGetByIdRoute', () => {
  const userUseCaseMock = getUserUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(userUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return user details on successful retrieval', async () => {
    const userId = faker.string.uuid();
    const user = userFactory({ id: userId });

    userUseCaseMock.executeGetUser.mockResolvedValue(user);

    const response = await userGetByIdRoute.request(`/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: userId });
    expect(userUseCaseMock.executeGetUser).toHaveBeenCalled();
  });

  it('should return 403 when user is not found', async () => {
    const userId = faker.string.uuid();

    userUseCaseMock.executeGetUser.mockRejectedValue(
      new AppError({ message: 'User not found', code: AppErrorCodes.CURRENT_USER_NOT_FOUND }),
    );

    const response = await userGetByIdRoute.request(`/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      message: 'Access forbidden',
      code: HttpCodes.FORBIDDEN,
    });
    expect(userUseCaseMock.executeGetUser).toHaveBeenCalled();
  });

  it('should return 403 when user not allowed to access', async () => {
    const userId = faker.string.uuid();

    userUseCaseMock.executeGetUser.mockRejectedValue(
      new AppError({ message: 'Unauthorized', code: AppErrorCodes.CURRENT_USER_NOT_ALLOWED }),
    );

    const response = await userGetByIdRoute.request(`/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      message: 'Access forbidden',
      code: HttpCodes.FORBIDDEN,
    });
    expect(userUseCaseMock.executeGetUser).toHaveBeenCalled();
  });
});
