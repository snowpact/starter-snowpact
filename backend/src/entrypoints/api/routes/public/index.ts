import { authLoginRoute } from './authLogin';
import { authRefreshRoute } from './authRefresh';
import { authRegisterRoute } from './authRegister';
import { authResetPasswordRoute } from './authResetPassword';
import { authResetPasswordRequestRoute } from './authResetPasswordRequest';
import { authValidateAccountRoute } from './authValidateAccount';
import { healthcheckRoute } from './healthcheck';
import { getHonoApp } from '../../loader/getHonoApp';

const publicRouter = getHonoApp();

publicRouter
  .route('/auth', authLoginRoute)
  .route('/auth', authRegisterRoute)
  .route('/auth', authRefreshRoute)
  .route('/auth', authResetPasswordRoute)
  .route('/auth', authResetPasswordRequestRoute)
  .route('/auth', authValidateAccountRoute)
  .route('/healthcheck', healthcheckRoute);

export { publicRouter };
