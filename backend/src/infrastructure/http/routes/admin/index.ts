import { jwt } from 'hono/jwt';

import { envConfig } from '@/infrastructure/config/env';
import { getHonoApp } from '@/infrastructure/http/config/getHonoApp';

import { getUserRoute } from './getUser';

const adminRouter = getHonoApp();

adminRouter.use(jwt({ secret: envConfig.ACCESS_TOKEN_SECRET })).route('/', getUserRoute);

export { adminRouter };
