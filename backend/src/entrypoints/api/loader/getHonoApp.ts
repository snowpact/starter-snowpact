import { OpenAPIHono } from '@hono/zod-openapi';
import { Env } from 'hono';
import { ZodError } from 'zod';

import { UserPayloadOptions } from '@/application/services/authToken/authToken.service.interface';

import { User } from '@/domain/entities/user/user.entity';

export interface CustomEnvInterface extends Env {
  Variables: {
    jwtPayload?: UserPayloadOptions;
    currentUser?: User;
  };
}

export const getHonoApp = (): OpenAPIHono<CustomEnvInterface> => {
  const app = new OpenAPIHono<CustomEnvInterface>({
    defaultHook: (result, c): Response | undefined => {
      if (!result.success) {
        return c.json(
          {
            message: 'Validation error',
            code: 'VALIDATION_ERROR',
            errors: formatZodErrors(result.error),
          },
          400,
        );
      }
    },
  });
  return app;
};

interface BadRequestDetailErrorsInterface {
  message: string;
  code: string;
  path: (string | number)[];
}

const formatZodErrors = (zodError: ZodError): BadRequestDetailErrorsInterface[] => {
  return zodError.issues.map((issue) => {
    return {
      message: issue.message,
      code: issue.code,
      path: issue.path,
    };
  });
};
