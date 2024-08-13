import { jwt } from 'hono/jwt';

import { envConfig } from '@/configuration/config/env';

import { userGetOneRoute } from './userGetOne';
import { getHonoApp } from '../../loader/getHonoApp';

const adminRouter = getHonoApp();

adminRouter.use(jwt({ secret: envConfig.ACCESS_TOKEN_SECRET })).route('/user/:id', userGetOneRoute);

export { adminRouter };
