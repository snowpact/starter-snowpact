import { createRoute } from '@hono/zod-openapi';

import { AppErrorCodes } from '@/core/errors/app.error.interface';
import { LoginUseCaseInterface } from '@/core/useCases/login/login.useCase.interface';

import { AppError } from '@/core/errors/app.error';
import { HttpCodes } from '@/entrypoints/api/config/httpCode';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { defaultResponseSchema } from '@/entrypoints/api/schemas/common.schema';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';

import { authLoginSchema } from './schema';

const authLoginRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authLoginSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: authLoginSchema.response,
        },
      },
      description: 'Login successfully',
    },
    400: {
      description: 'Invalid credentials',
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
    },
  },
});

authLoginRoute.openapi(route, async (c) => {
  const { email, password } = c.req.valid('json');

  const loginUseCase = mainContainer.get<LoginUseCaseInterface>(TYPES.LoginUseCase);
  const { accessToken, refreshToken } = await loginUseCase.executeLogin(email, password);

  return c.json({ accessToken, refreshToken }, HttpStatuses.OK);
});

authLoginRoute.onError((error, c) => {
  if (!(error instanceof AppError)) {
    throw error;
  }

  switch (error.code) {
    case AppErrorCodes.USER_NOT_FOUND:
    case AppErrorCodes.BAD_PASSWORD:
      return c.json(
        { message: 'Invalid credentials', code: HttpCodes.INVALID_CREDENTIALS },
        HttpStatuses.BAD_REQUEST,
      );
    default:
      throw error;
  }
});

export { authLoginRoute };