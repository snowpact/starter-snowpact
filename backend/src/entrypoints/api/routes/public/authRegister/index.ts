import { createRoute } from '@hono/zod-openapi';

import { RegisterUseCaseInterface } from '@/application/useCases/register/register.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { defaultResponseSchema } from '@/entrypoints/api/schemas/common.schema';

import { authRegisterSchema } from './schema';

const authRegisterRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/register',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authRegisterSchema.body,
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
      description: 'Login successfully',
    },
    400: {
      description: 'Email already taken or invalid password',
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
    },
  },
});

authRegisterRoute.openapi(route, async (c) => {
  const { email, password } = c.req.valid('json');

  const registerUseCase = mainContainer.get<RegisterUseCaseInterface>(TYPES.RegisterUseCase);
  await registerUseCase.executeRegister(email, password);

  return c.json({ code: 'USER_CREATED', message: 'User created successfully' }, HttpStatuses.OK);
});

export { authRegisterRoute };
