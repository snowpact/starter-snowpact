import { createRoute } from '@hono/zod-openapi';

import { mainContainer } from '@/infrastructure/di/mainContainer';

import { resetPasswordBodySchema, resetPasswordResponseSchema } from './schema';
import { ResetPasswordUseCaseInterface } from '../../../../../../application/useCases/resetPassword/resetPassword.useCase.interface';
import { TYPES } from '../../../../../di/types';
import { getHonoApp } from '../../../../config/getHonoApp';
import { HttpStatuses } from '../../../../config/httpStatuses';

const resetPasswordRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/reset-password',
  request: {
    body: {
      content: {
        'application/json': {
          schema: resetPasswordBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: resetPasswordResponseSchema,
        },
      },
      description: 'Password reset successfully',
    },
  },
});

resetPasswordRoute.openapi(route, async (c) => {
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

export { resetPasswordRoute };
