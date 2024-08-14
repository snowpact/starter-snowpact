import { authorizationMiddleware } from '@/entrypoints/api/middlewares/authorization/authorization.middleware';

import { userGetOneRoute } from './userGetOne';
import { getHonoApp } from '../../loader/getHonoApp';

const adminRouter = getHonoApp();

adminRouter
  .use(authorizationMiddleware({ shouldBeAdmin: true, optional: false }))
  .route('/user', userGetOneRoute);

export { adminRouter };
