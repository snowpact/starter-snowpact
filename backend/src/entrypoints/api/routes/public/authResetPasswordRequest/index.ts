import { createRoute } from '@hono/zod-openapi';

import { AppErrorCodes } from '@/core/errors/app.error.interface';
import { ResetPasswordUseCaseInterface } from '@/core/useCases/resetPassword/resetPassword.useCase.interface';

import { AppError } from '@/core/errors/app.error';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { defaultResponseSchema } from '@/entrypoints/api/schemas/common.schema';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';

import { authResetPasswordRequestSchema } from './schema';

const authResetPasswordRequestRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authResetPasswordRequestSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
      description: 'Ask for reset password email sent successfully',
    },
  },
});

authResetPasswordRequestRoute.openapi(route, async (c) => {
  const { email } = c.req.valid('json');

  const resetPasswordUseCase = mainContainer.get<ResetPasswordUseCaseInterface>(
    TYPES.ResetPasswordUseCase,
  );

  await resetPasswordUseCase.executeAskResetPassword(email);
  return c.json({ message: 'Email sent', code: 'EMAIL_SENT' }, HttpStatuses.OK);
});

authResetPasswordRequestRoute.onError((error, c) => {
  if (!(error instanceof AppError)) {
    throw error;
  }

  switch (error.code) {
    case AppErrorCodes.USER_NOT_FOUND:
    case AppErrorCodes.FAILED_TO_SEND_EMAIL:
      return c.json({ message: 'Email sent', code: 'EMAIL_SENT' }, HttpStatuses.OK);
    default:
      throw error;
  }
});

export { authResetPasswordRequestRoute };
