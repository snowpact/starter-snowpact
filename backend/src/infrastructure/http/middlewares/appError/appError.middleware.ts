import { ErrorHandler, Env } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { isAppError } from '@/application/errors/error.util';
import { LoggerService } from '@/infrastructure/services/logger/logger.service';

import { HttpStatuses } from '../../config/httpStatuses';

export const appErrorMiddleware: ErrorHandler<Env> = (error, c) => {
  const logger = new LoggerService();
  if (isAppError(error)) {
    const { code, context, message } = error;
    const statusCode = getStatusCodeFromErrorCode(code);
    return c.json(
      {
        message,
        code,
        context,
      },
      statusCode,
    );
  }

  if (error instanceof HTTPException) {
    // Get the custom response
    return error.getResponse();
  }

  if (error instanceof ZodError) {
    return c.json(
      {
        message: 'Invalid request body',
        statusCode: HttpStatuses.BAD_REQUEST,
        code: 'invalid_request_body',
        context: error.errors,
      },
      HttpStatuses.BAD_REQUEST,
    );
  }

  logger.error(error.message, error);
  return c.json(
    {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
    HttpStatuses.INTERNAL_SERVER_ERROR,
  );
};

const getStatusCodeFromErrorCode = (errorCode?: string): HttpStatuses => {
  switch (errorCode) {
    case AppErrorCodes.USER_NOT_FOUND:
      return HttpStatuses.NOT_FOUND;
    case AppErrorCodes.INVALID_TOKEN:
      return HttpStatuses.BAD_REQUEST;
    case AppErrorCodes.INVALID_DATA_PROVIDED:
      return HttpStatuses.BAD_REQUEST;
    case AppErrorCodes.BAD_PASSWORD:
      return HttpStatuses.BAD_REQUEST;
    case AppErrorCodes.FAILED_TO_SEND_EMAIL:
      return HttpStatuses.INTERNAL_SERVER_ERROR;
    default:
      return HttpStatuses.INTERNAL_SERVER_ERROR;
  }
};
