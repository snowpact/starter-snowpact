import { z } from '@hono/zod-openapi';

export const getProductsJsonSchema = z.object({
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});
