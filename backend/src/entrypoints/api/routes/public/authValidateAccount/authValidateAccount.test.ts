import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { mainContainer } from '@/configuration/di/mainContainer';

import { getValidateAccountUseCaseMock } from '@/application/useCases/validateAccount/validateAccount.useCase.mock';

import { authValidateAccountRoute } from './index';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('authValidateAccountRoute', () => {
  const validateAccountUseCaseMock = getValidateAccountUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(validateAccountUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should validate account successfully', async () => {
    const token = 'valid_token';

    validateAccountUseCaseMock.executeValidateAccount.mockResolvedValue(undefined);

    const response = await authValidateAccountRoute.request('/validate-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: 'Account validated successfully',
      code: 'ACCOUNT_VALIDATED',
    });
    expect(validateAccountUseCaseMock.executeValidateAccount).toHaveBeenCalledWith(token);
  });
});
