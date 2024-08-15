import { ServerType, serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';

import { envConfig } from '@/configuration/env/envConfig.singleton';
import { appLogger } from '@/configuration/logger/logger.singleton';

import { CustomEnvInterface, getHonoApp } from './getHonoApp';
import { apiDocMiddleware } from '../middlewares/apiDoc/apiDoc.middleware';
import { appErrorMiddleware } from '../middlewares/appError/appError.middleware';
import { authenticationMiddleware } from '../middlewares/authentication/authentication.middleware';
import { requestIdMiddleware } from '../middlewares/requestId/requestId.middleware';
import { routes } from '../routes';

export const bootstrap = (): { app: OpenAPIHono<CustomEnvInterface>; server: ServerType } => {
  const app = getHonoApp();
  app
    .use(cors())
    .use(logger())
    .use(prettyJSON())
    .use(requestIdMiddleware)
    .use(authenticationMiddleware)
    .route('/api', routes);

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
      port: envConfig.port,
    },
    () => {
      appLogger.info(`Server is running on port ${envConfig.port}`);
    },
  );

  return { app, server };
};
