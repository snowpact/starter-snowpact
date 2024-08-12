import { createRoute } from '@hono/zod-openapi';

import { ResetPasswordUseCaseInterface } from '@/core/useCases/resetPassword/resetPassword.useCase.interface';

import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';

import { authResetPasswordBodySchema, authResetPasswordResponseSchema } from './schema';

const authResetPasswordRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authResetPasswordBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: authResetPasswordResponseSchema,
        },
      },
      description: 'Password reset successfully',
    },
  },
});

authResetPasswordRoute.openapi(route, async (c) => {
  const { token, password } = c.req.valid('json');

  const resetPasswordUseCase = mainContainer.get<ResetPasswordUseCaseInterface>(
    TYPES.ResetPasswordUseCase,
  );

  await resetPasswordUseCase.executeResetPassword(token, password);

  return c.json(
    { message: 'Password reset successfully', code: 'PASSWORD_RESET_SUCCESSFULLY' },
    HttpStatuses.OK,
  );
});

export { authResetPasswordRoute };
