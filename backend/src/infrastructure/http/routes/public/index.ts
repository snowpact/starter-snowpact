import { authRouter } from './auth';
import { getProductRoute } from './getProduct';
import { getProductsRoute } from './getProducts';
import { getHonoApp } from '../../config/getHonoApp';

const publicRouter = getHonoApp();

publicRouter.route('/', getProductRoute).route('/', getProductsRoute).route('/', authRouter);

export { publicRouter };
