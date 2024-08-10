import { createRoute } from '@hono/zod-openapi';

import { getHonoApp } from '@/infrastructure/http/config/getHonoApp';
import { HttpStatuses } from '@/infrastructure/http/config/httpStatuses';

import { statusResponseSchema } from './schema';

const statusRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/status',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: statusResponseSchema,
        },
      },
      description: 'Status OK',
    },
  },
});

statusRoute.openapi(route, (c) => {
  return c.json({ message: 'OK' }, HttpStatuses.OK);
});

export { statusRoute };
