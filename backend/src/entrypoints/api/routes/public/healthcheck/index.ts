import { createRoute } from '@hono/zod-openapi';

import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { healthcheckResponseSchema } from './schema';

const healthcheckRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/',
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
