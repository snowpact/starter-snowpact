import { jwt } from 'hono/jwt';

import { envConfig } from '@/infrastructure/config/env';
import { getHonoApp } from '@/infrastructure/http/config/getHonoApp';

import { userGetOneRoute } from './userGetOne';

const adminRouter = getHonoApp();

adminRouter.use(jwt({ secret: envConfig.ACCESS_TOKEN_SECRET })).route('/', userGetOneRoute);

export { adminRouter };
