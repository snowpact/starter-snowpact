import { createRoute } from '@hono/zod-openapi';

import { AppErrorCodes } from '@/application/errors/app.error.interface';
import { GetUserUseCaseInterface } from '@/application/useCases/getUser/getUser.useCase.interface';
import { UserPayloadOptions } from '@/gateways/authToken/authToken.service.interface';

import { AppError } from '@/application/errors/app.error';
import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpCodes } from '@/entrypoints/api/config/httpCode';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';
import { defaultResponseSchema } from '@/entrypoints/api/schemas/common.schema';
import { UserSerializer } from '@/entrypoints/api/serializers/user.serializer';

import { getUserSchema } from './schema';

const userGetOneRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/:id',
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

userGetOneRoute.openapi(route, async (c) => {
  const { id } = c.req.valid('param');
  const userId = (c.get('jwtPayload') as UserPayloadOptions)?.userId;

  const getUserUseCase = mainContainer.get<GetUserUseCaseInterface>(TYPES.GetUserUseCase);
  const user = await getUserUseCase.executeGetUser({ currentUserId: userId, userId: id });

  return c.json(UserSerializer.serialize(user), HttpStatuses.OK);
});

userGetOneRoute.onError((error, c) => {
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

export { userGetOneRoute };
