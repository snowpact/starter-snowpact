import { Context } from 'hono';

export const orderGetOneRoute = (c: Context) => {
  return c.json({ message: 'Hello, world!' });
};
