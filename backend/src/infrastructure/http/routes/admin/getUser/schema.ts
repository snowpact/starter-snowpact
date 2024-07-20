import { z } from '@hono/zod-openapi';

export const getUserSchema = {
  params: z.object({
    id: z.string().uuid(),
  }),
  response: z
    .object({
      id: z.string().uuid(),
      email: z.string().email(),
      admin: z.boolean(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
    .openapi('GetUserResponse'),
};
