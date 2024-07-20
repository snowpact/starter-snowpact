import { askResetPasswordRoute } from './askResetPassword';
import { loginRoute } from './login';
import { resetPasswordRoute } from './resetPassword';
import { getHonoApp } from '../../../config/getHonoApp';

const authRouter = getHonoApp();

authRouter.route('/', loginRoute).route('/', askResetPasswordRoute).route('/', resetPasswordRoute);

export { authRouter };
