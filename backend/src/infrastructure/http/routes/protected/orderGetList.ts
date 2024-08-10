import { Context } from 'hono';

export const orderGetListRoute = (c: Context) => {
  return c.json({ message: 'Hello, world!' });
};
