import { createRoute } from '@hono/zod-openapi';

import { getProductParamsSchema, getProductResponseSchema } from './schema';
import { getHonoApp } from '../../../loader/getHonoApp';

const productGetOneRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/',
  request: {
    params: getProductParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getProductResponseSchema,
        },
      },
      description: 'Get product successfully',
    },
  },
});

productGetOneRoute.openapi(route, (c) => {
  const { id } = c.req.valid('param');
  return c.json({ id });
});

export { productGetOneRoute };