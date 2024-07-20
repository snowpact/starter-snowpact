import { Context } from 'hono';

export const apiDocMiddleware = (c: Context) => ({
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
  servers: [
    {
      url: new URL(c.req.url).origin,
      description: 'Current environment',
    },
  ],
});
