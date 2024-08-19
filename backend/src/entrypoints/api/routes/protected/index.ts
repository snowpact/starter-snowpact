import { getHonoApp } from '../../loader/getHonoApp';
import { authorizationMiddleware } from '../../middlewares/authorization/authorization.middleware';

const protectedRouter = getHonoApp();

protectedRouter.use(authorizationMiddleware({ shouldBeAdmin: false, optional: false })).use('*');

export { protectedRouter };
