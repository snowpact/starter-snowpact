import { jwt } from 'hono/jwt';

import { envConfig } from '@/configuration/env/envConfig';

import { userGetOneRoute } from './userGetOne';
import { getHonoApp } from '../../loader/getHonoApp';

const adminRouter = getHonoApp();

adminRouter.use(jwt({ secret: envConfig.ACCESS_TOKEN_SECRET })).route('/user', userGetOneRoute);

export { adminRouter };
