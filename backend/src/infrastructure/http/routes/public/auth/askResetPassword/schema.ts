import { z } from '@hono/zod-openapi';

export const askResetPasswordSchema = {
  body: z.object({
    email: z.string().email(),
  }),
};
