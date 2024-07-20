import { createRoute } from '@hono/zod-openapi';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { LoginUseCaseInterface } from '@/application/useCases/login/login.useCase.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';
import { getHonoApp } from '@/infrastructure/http/config/getHonoApp';
import { HttpCodes } from '@/infrastructure/http/config/httpCode';
import { HttpStatuses } from '@/infrastructure/http/config/httpStatuses';
import { defaultResponseSchema } from '@/infrastructure/http/routes/shared/schema/default.response.schema';

import { loginSchema } from './schema';

const loginRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/login',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: loginSchema.response,
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

loginRoute.openapi(route, async (c) => {
  const { email, password } = c.req.valid('json');

  const loginUseCase = mainContainer.get<LoginUseCaseInterface>(TYPES.LoginUseCase);
  const { accessToken, refreshToken } = await loginUseCase.executeLogin(email, password);

  return c.json({ accessToken, refreshToken }, HttpStatuses.OK);
});

loginRoute.onError((error, c) => {
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

export { loginRoute };
