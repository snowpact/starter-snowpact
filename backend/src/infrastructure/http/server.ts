import { ServerType, serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { getHonoApp } from './config/getHonoApp';
import { apiDocMiddleware } from './middlewares/apiDoc.middleware';
import { appErrorMiddleware } from './middlewares/appError/appError.middleware';
import { requestId } from './middlewares/requestId.middleware';
import { routes } from './routes';
import { envConfig } from '../config/env';
import { LoggerService } from '../services/logger/logger.service';

export const bootstrap = (): { app: OpenAPIHono; server: ServerType } => {
  const app = getHonoApp();
  app.use(cors()).use(logger()).use(prettyJSON()).use(requestId).route('/api', routes);

  app.onError(appErrorMiddleware);
  app.doc('api/doc', apiDocMiddleware);
  app.get('/ui', swaggerUI({ url: '/api/doc' }));
  app.get(
    '/reference',
    apiReference({
      spec: {
        url: '/api/doc',
      },
    }),
  );

  const server = serve(
    {
      fetch: app.fetch,
      port: envConfig.PORT,
    },
    () => {
      const logger = new LoggerService();
      logger.info(`Server is running on port ${envConfig.PORT}`);
    },
  );

  return { app, server };
};
