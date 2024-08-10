import { zValidator } from '@hono/zod-validator';

import { getProductsJsonSchema } from './schema';
import { getHonoApp } from '../../../config/getHonoApp';

const productGetListRoute = getHonoApp();

productGetListRoute.get('/product', zValidator('json', getProductsJsonSchema), (c): Response => {
  const { limit, offset } = c.req.valid('json');

  return c.json({ limit, offset });
});

export { productGetListRoute };
