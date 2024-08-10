import { z } from '@hono/zod-openapi';

export const healthcheckResponseSchema = z
  .object({
    message: z.string(),
    timestamp: z.string(),
    uptime: z.number(),
  })
  .openapi('HealthcheckResponse');
