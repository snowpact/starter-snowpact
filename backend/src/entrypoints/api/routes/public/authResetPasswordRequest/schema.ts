import { z } from '@hono/zod-openapi';

export const authResetPasswordRequestSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};
