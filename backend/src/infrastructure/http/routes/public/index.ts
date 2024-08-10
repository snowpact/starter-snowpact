import { authLoginRoute } from './authLogin';
import { authResetPasswordRoute } from './authResetPassword';
import { authResetPasswordRequestRoute } from './authResetPasswordRequest';
import { productGetListRoute } from './productGetList';
import { productGetOneRoute } from './productGetOne';
import { statusRoute } from './status';
import { getHonoApp } from '../../config/getHonoApp';

const publicRouter = getHonoApp();

publicRouter
  .route('/', authLoginRoute)
  .route('/', authResetPasswordRoute)
  .route('/', authResetPasswordRequestRoute)
  .route('/', authResetPasswordRequestRoute)
  .route('/', productGetListRoute)
  .route('/', productGetOneRoute)
  .route('/', statusRoute);

export { publicRouter };
