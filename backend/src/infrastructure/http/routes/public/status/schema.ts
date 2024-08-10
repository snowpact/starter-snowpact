import { z } from '@hono/zod-openapi';

export const getStatusResponseSchema = z
  .object({
    message: z.string(),
  })
  .openapi('GetStatusResponse');
