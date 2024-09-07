import { createRoute } from '@hono/zod-openapi';

import { ValidateAccountUseCaseInterface } from '@/application/useCases/validateAccount/validateAccount.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { defaultResponseSchema } from '@/entrypoints/api/schemas/common.schema';

import { authValidateAccountSchema } from './schema';

const authValidateAccountRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/validate-account',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authValidateAccountSchema.body,
        },
      },
    },
  },
  tags: ['public', 'auth'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
      description: 'Account validated successfully',
    },
    400: {
      description: 'Invalid token',
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
    },
  },
});

authValidateAccountRoute.openapi(route, async (c) => {
  const { token } = c.req.valid('json');

  const validateAccountUseCase = mainContainer.get<ValidateAccountUseCaseInterface>(
    TYPES.ValidateAccountUseCase,
  );

  await validateAccountUseCase.executeValidateAccount(token);

  return c.json(
    { message: 'Account validated successfully', code: 'ACCOUNT_VALIDATED' },
    HttpStatuses.OK,
  );
});

export { authValidateAccountRoute };
