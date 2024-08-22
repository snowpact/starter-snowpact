import { z } from '@hono/zod-openapi';

export const authRegisterSchema = {
  body: z.object({
    email: z.string().email().openapi({ example: 'john.doe@example.com' }),
    password: z.string().min(1).openapi({ example: 'password' }),
  }),
};
