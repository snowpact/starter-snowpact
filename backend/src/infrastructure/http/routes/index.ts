import { adminRouter } from './admin';
import { protectedRouter } from './protected';
import { publicRouter } from './public';
import { getHonoApp } from '../config/getHonoApp';

const routes = getHonoApp();

routes.route('/admin', adminRouter).route('/protected', protectedRouter).route('/', publicRouter);

export { routes };
