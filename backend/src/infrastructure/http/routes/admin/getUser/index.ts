import { createRoute } from '@hono/zod-openapi';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { UserPayloadOptions } from '@/application/helpers/accountToken/accountToken.service.interface';
import { GetUserUseCaseInterface } from '@/application/useCases/getUser/getUser.useCase.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/infrastructure/di/mainContainer';
import { TYPES } from '@/infrastructure/di/types';
import { HttpCodes } from '@/infrastructure/http/config/httpCode';
import { HttpStatuses } from '@/infrastructure/http/config/httpStatuses';

import { getUserSchema } from './schema';
import { getHonoApp } from '../../../config/getHonoApp';
import { defaultResponseSchema } from '../../shared/schema/default.response.schema';

const getUserRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/user/{id}',
  request: {
    params: getUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUserSchema.response,
        },
      },
      description: 'Get user successfully',
    },
    401: {
      description: 'Unauthorized',
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
    },
    403: {
      description: 'Forbidden',
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
    },
    404: {
      description: 'User not found',
      content: {
        'application/json': {
          schema: defaultResponseSchema,
        },
      },
    },
  },
});

getUserRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const { userId } = c.get('jwtPayload') as UserPayloadOptions;

  const getUserUseCase = mainContainer.get<GetUserUseCaseInterface>(TYPES.GetUserUseCase);
  const user = await getUserUseCase.executeGetUser({ currentUserId: userId, userId: id });

  return c.json(
    {
      id: user.id,
      email: user.email,
      admin: user.admin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    HttpStatuses.OK,
  );
});

getUserRoute.onError((error, c) => {
  if (!(error instanceof AppError)) {
    throw error;
  }

  switch (error.code) {
    case AppErrorCodes.CURRENT_USER_NOT_FOUND:
    case AppErrorCodes.CURRENT_USER_NOT_ALLOWED:
      return c.json(
        { message: 'Access forbidden', code: HttpCodes.FORBIDDEN },
        HttpStatuses.FORBIDDEN,
      );
    default:
      throw error;
  }
});

export { getUserRoute };
