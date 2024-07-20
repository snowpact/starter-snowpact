import { Context } from 'hono';

export const getOrder = (c: Context) => {
  return c.json({ message: 'Hello, world!' });
};
