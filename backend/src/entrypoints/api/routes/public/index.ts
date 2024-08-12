import { authLoginRoute } from './authLogin';
import { authResetPasswordRoute } from './authResetPassword';
import { authResetPasswordRequestRoute } from './authResetPasswordRequest';
import { healthcheckRoute } from './healthcheck';
import { productGetListRoute } from './productGetList';
import { productGetOneRoute } from './productGetOne';
import { getHonoApp } from '../../loader/getHonoApp';

const publicRouter = getHonoApp();

publicRouter
  .route('/auth/login', authLoginRoute)
  .route('/auth/reset-password', authResetPasswordRoute)
  .route('/auth/reset-password-request', authResetPasswordRequestRoute)
  .route('/product', productGetListRoute)
  .route('/product/:id', productGetOneRoute)
  .route('/healthcheck', healthcheckRoute);

export { publicRouter };
