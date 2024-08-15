import { AsyncLocalStorage } from 'async_hooks';

import { every } from 'hono/combine';
import { createMiddleware } from 'hono/factory';
import { requestId as honoRequestId } from 'hono/request-id';

export const asyncLocalStorage = new AsyncLocalStorage<{ requestId?: string }>();

const storeRequestId = createMiddleware(async (c, next) => {
  const requestId = c.get('requestId');
  await asyncLocalStorage.run({ requestId }, async () => {
    await next();
  });
});

export const requestIdMiddleware = every(honoRequestId(), storeRequestId);
