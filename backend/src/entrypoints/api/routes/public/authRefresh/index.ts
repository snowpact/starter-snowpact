import { createRoute } from '@hono/zod-openapi';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { RefreshUseCaseInterface } from '@/application/useCases/refresh/refresh.useCase.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpCodes } from '@/entrypoints/api/config/httpCode';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { defaultResponseSchema } from '@/entrypoints/api/schemas/common.schema';

import { authRefreshSchema } from './schema';

const authRefreshRoute = getHonoApp();

const route = createRoute({
  method: 'post',
  path: '/refresh',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authRefreshSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: authRefreshSchema.response,
        },
      },
      description: 'Refresh successfully',
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

authRefreshRoute.openapi(route, async (c) => {
  const { accessToken: oldAccessToken, refreshToken: oldRefreshToken } = c.req.valid('json');

  const refreshUseCase = mainContainer.get<RefreshUseCaseInterface>(TYPES.RefreshUseCase);
  const { accessToken, refreshToken } = await refreshUseCase.executeRefresh(
    oldAccessToken,
    oldRefreshToken,
  );

  return c.json({ accessToken, refreshToken }, HttpStatuses.OK);
});

authRefreshRoute.onError((error, c) => {
  if (!(error instanceof AppError)) {
    throw error;
  }

  switch (error.code) {
    case AppErrorCodes.USER_NOT_FOUND:
    case AppErrorCodes.INVALID_JWT_TOKEN:
    case AppErrorCodes.TOKEN_NOT_FOUND:
    case AppErrorCodes.TOKEN_EXPIRED:
    case AppErrorCodes.TOKEN_TYPE_MISMATCH:
    case AppErrorCodes.TOKEN_USER_ID_MISMATCH:
      return c.json(
        { message: 'Invalid credentials', code: HttpCodes.INVALID_CREDENTIALS },
        HttpStatuses.BAD_REQUEST,
      );
    default:
      throw error;
  }
});

export { authRefreshRoute };
