import { authorizationMiddleware } from '@/entrypoints/api/middlewares/authorization/authorization.middleware';

import { userGetByIdRoute } from './userGetById';
import { getHonoApp } from '../../loader/getHonoApp';

const adminRouter = getHonoApp();

adminRouter
  .use(authorizationMiddleware({ shouldBeAdmin: true, optional: false }))
  .route('/user', userGetByIdRoute);

export { adminRouter };
