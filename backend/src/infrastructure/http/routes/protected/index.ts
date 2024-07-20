import { getOrder } from './getOrder';
import { getOrders } from './getOrders';
import { getHonoApp } from '../../config/getHonoApp';

const protectedRouter = getHonoApp();

protectedRouter.get('/orders', getOrders).get('/orders/:id', getOrder);

export { protectedRouter };
