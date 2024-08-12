import { orderGetListRoute } from './orderGetList';
import { orderGetOneRoute } from './orderGetOne';
import { getHonoApp } from '../../loader/getHonoApp';

const protectedRouter = getHonoApp();

protectedRouter.get('/orders', orderGetListRoute).get('/orders/:id', orderGetOneRoute);

export { protectedRouter };
