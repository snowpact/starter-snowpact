import { faker } from '@faker-js/faker';
import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { mainContainer } from '@/configuration/di/mainContainer';

import { getRegisterUseCaseMock } from '@/application/useCases/register/register.useCase.mock';

import { authRegisterRoute } from '.';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('authRegisterRoute', () => {
  const registerUseCaseMock = getRegisterUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(registerUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register a user', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    registerUseCaseMock.executeRegister.mockResolvedValue(undefined);

    const response = await authRegisterRoute.request('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      code: 'USER_CREATED',
      message: 'User created successfully',
    });
    expect(registerUseCaseMock.executeRegister).toHaveBeenCalledWith(email, password);
  });
});
