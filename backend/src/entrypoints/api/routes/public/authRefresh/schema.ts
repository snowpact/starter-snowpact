import { z } from '@hono/zod-openapi';

export const authRefreshSchema = {
  body: z.object({
    accessToken: z.string().openapi({ example: 'access_token_123' }),
    refreshToken: z.string().openapi({ example: 'refresh_token_456' }),
  }),
  response: z
    .object({
      accessToken: z.string(),
      refreshToken: z.string(),
    })
    .openapi('RefreshTokens'),
};
