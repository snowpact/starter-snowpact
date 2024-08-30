import { z } from 'zod';

export const sendEmailWorkerSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
});

export type SendEmailWorkerOptions = z.infer<typeof sendEmailWorkerSchema>;
