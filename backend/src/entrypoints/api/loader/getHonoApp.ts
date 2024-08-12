import { OpenAPIHono } from '@hono/zod-openapi';
import { ZodError } from 'zod';

export const getHonoApp = (): OpenAPIHono => {
  const app = new OpenAPIHono({
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
