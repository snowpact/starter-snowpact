import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { mainContainer } from '@/configuration/di/mainContainer';

import { getResendValidationEmailUseCaseMock } from '@/application/useCases/resendValidationEmail/resendValidationEmail.useCase.mock';

import { authResendValidationEmailRoute } from './index';

vi.mock('@/configuration/di/mainContainer', () => ({
  mainContainer: {
    get: vi.fn(),
  },
}));

vi.mock('@/entrypoints/api/loader/getHonoApp', () => ({
  getHonoApp: () => new OpenAPIHono(),
}));

describe('authResendValidationEmailRoute', () => {
  const resendValidationEmailUseCaseMock = getResendValidationEmailUseCaseMock();

  beforeEach(() => {
    vi.mocked(mainContainer.get).mockReturnValue(resendValidationEmailUseCaseMock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should resend validation email successfully', async () => {
    const email = 'test@example.com';

    const response = await authResendValidationEmailRoute.request('/resend-validation-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      message: 'Validation email resent successfully',
      code: 'EMAIL_RESENT',
    });
    expect(resendValidationEmailUseCaseMock.executeResendValidationEmail).toHaveBeenCalledWith({
      email,
      token: undefined,
    });
  });
});
