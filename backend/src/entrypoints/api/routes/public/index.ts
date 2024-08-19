import { authLoginRoute } from './authLogin';
import { authResetPasswordRoute } from './authResetPassword';
import { authResetPasswordRequestRoute } from './authResetPasswordRequest';
import { healthcheckRoute } from './healthcheck';
import { getHonoApp } from '../../loader/getHonoApp';

const publicRouter = getHonoApp();

publicRouter
  .route('/auth', authLoginRoute)
  .route('/auth', authResetPasswordRoute)
  .route('/auth', authResetPasswordRequestRoute)
  .route('/healthcheck', healthcheckRoute);

export { publicRouter };
