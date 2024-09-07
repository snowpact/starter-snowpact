import { createRoute } from '@hono/zod-openapi';

import { ResendValidationEmailUseCaseInterface } from '@/application/useCases/resendValidationEmail/resendValidationEmail.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { defaultResponseSchema } from '@/entrypoints/api/schemas/common.schema';

import { authResendValidationEmailSchema } from './schema';

const authResendValidationEmailRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/resend-validation-email',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authResendValidationEmailSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  operationId: 'authResendValidationEmail',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
      description: 'Validation email resent successfully',
    },
    400: {
      description: 'Invalid request',
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
    },
  },
});

authResendValidationEmailRoute.openapi(route, async (c) => {
  const { email, token } = c.req.valid('json');

  const resendValidationEmailUseCase = mainContainer.get<ResendValidationEmailUseCaseInterface>(
    TYPES.ResendValidationEmailUseCase,
  );

  await resendValidationEmailUseCase.executeResendValidationEmail({ email, token });

  return c.json(
    { message: 'Validation email resent successfully', code: 'EMAIL_RESENT' },
    HttpStatuses.OK,
  );
});

export { authResendValidationEmailRoute };
