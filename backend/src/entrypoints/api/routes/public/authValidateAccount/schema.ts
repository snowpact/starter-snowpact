import { z } from '@hono/zod-openapi';

export const authValidateAccountSchema = {
  body: z.object({
    token: z.string().min(1).openapi({ example: 'validation_token_123' }),
  }),
};
