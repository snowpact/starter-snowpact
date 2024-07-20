import { Context } from 'hono';

export const getOrders = (c: Context) => {
  return c.json({ message: 'Hello, world!' });
};
