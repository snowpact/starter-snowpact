import { z } from '@hono/zod-openapi';

export const statusResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('GetStatusResponse');
