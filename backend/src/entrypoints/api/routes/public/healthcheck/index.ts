import { createRoute } from '@hono/zod-openapi';

import { MailSenderInterface } from '@/domain/interfaces/mailSender.interface';

import { mainContainer } from '@/configuration/di/mainContainer';
import { TYPES } from '@/configuration/di/types';
import { HttpStatuses } from '@/entrypoints/api/config/httpStatuses';
import { getHonoApp } from '@/entrypoints/api/loader/getHonoApp';

import { healthcheckResponseSchema } from './schema';

const healthcheckRoute = getHonoApp();

const route = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: healthcheckResponseSchema,
        },
      },
      description: 'Healthcheck OK',
    },
  },
});

healthcheckRoute.openapi(route, async (c) => {
  const mailSender = mainContainer.get<MailSenderInterface>(TYPES.MailSender);

  await mailSender.sendResetPasswordEmail({
    email: 'test@test.com',
    token: '1234567890',
  });

  return c.json(
    {
      message: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    HttpStatuses.OK,
  );
});

export { healthcheckRoute };
