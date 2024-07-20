import { z } from '@hono/zod-openapi';

export const loginSchema = {
  body: z.object({
    email: z.string().email().openapi({ example: 'john.doe@example.com' }),
    password: z.string().openapi({ example: 'password' }),
  }),
  response: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .openapi('LoginTokens'),
};
