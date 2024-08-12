import { adminRouter } from './admin';
import { protectedRouter } from './protected';
import { publicRouter } from './public';
import { getHonoApp } from '../loader/getHonoApp';

const routes = getHonoApp();

routes
  .route('/admin', adminRouter)
  .route('/protected', protectedRouter)
  .route('/public', publicRouter);

export { routes };
