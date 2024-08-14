import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

import { GetUserUseCaseInterface } from '@/application/useCases/getUser/getUser.useCase.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';

import { CustomEnvInterface } from '../../loader/getHonoApp';

interface AuthorizationOptions {
  shouldBeAdmin?: boolean;
  optional?: boolean;
}

export const authorizationMiddleware = ({ shouldBeAdmin, optional }: AuthorizationOptions = {}) => {
  return createMiddleware<CustomEnvInterface>(async (c, next) => {
    if (optional) {
      await next();
      return;
    }

    const jwtPayload = c.get('jwtPayload');
    if (!jwtPayload) {
      throw new HTTPException(401, { message: 'Unauthorized' });
    }

    const getUserUseCase = mainContainer.get<GetUserUseCaseInterface>(TYPES.GetUserUseCase);
    const user = await getUserUseCase.executeGetUser({ userId: jwtPayload.userId });
    if (!user) {
      throw new HTTPException(401, { message: 'User not found' });
    }

    if (shouldBeAdmin && !user.admin) {
      throw new HTTPException(403, { message: 'Forbidden' });
    }

    c.set('currentUser', user);

    await next();
  });
};
