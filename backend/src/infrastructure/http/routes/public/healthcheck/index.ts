import { createRoute } from '@hono/zod-openapi';

import { getHonoApp } from '@/infrastructure/http/config/getHonoApp';
import { HttpStatuses } from '@/infrastructure/http/config/httpStatuses';

import { healthcheckResponseSchema } from './schema';

const healthcheckRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/healthcheck',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: healthcheckResponseSchema,
        },
      },
      description: 'Healthcheck OK',
    },
  },
});

healthcheckRoute.openapi(route, (c) => {
  return c.json(
    {
      message: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    HttpStatuses.OK,
  );
});

export { healthcheckRoute };
