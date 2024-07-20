import { zValidator } from '@hono/zod-validator';

import { getProductsJsonSchema } from './validator';
import { getHonoApp } from '../../../config/getHonoApp';

const getProductsRoute = getHonoApp();

getProductsRoute.get('/product', zValidator('json', getProductsJsonSchema), (c): Response => {
  const { limit, offset } = c.req.valid('json');

  return c.json({ limit, offset });
});

export { getProductsRoute };
