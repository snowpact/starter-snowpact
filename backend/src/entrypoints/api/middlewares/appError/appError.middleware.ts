import { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { Logger } from '@/adapters/logger/logger';
import { isAppError } from '@/application/errors/error.util';

import { HttpStatuses } from '../../config/httpStatuses';
import { CustomEnvInterface } from '../../loader/getHonoApp';

export const appErrorMiddleware: ErrorHandler<CustomEnvInterface> = (error, c) => {
  const appLogger = new Logger();
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
    appLogger.debug(error.message, { error });
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

  appLogger.error(error.message, error);
  return c.json(
    {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
    HttpStatuses.INTERNAL_SERVER_ERROR,
  );
};

export const getStatusCodeFromErrorCode = (errorCode?: string): HttpStatuses => {
  switch (errorCode) {
    case AppErrorCodes.USER_NOT_FOUND:
      return HttpStatuses.NOT_FOUND;
    case AppErrorCodes.INVALID_DATA_PROVIDED:
    case AppErrorCodes.BAD_PASSWORD:
    case AppErrorCodes.INVALID_PASSWORD_COMPLEXITY:
    case AppErrorCodes.EMAIL_ALREADY_TAKEN:
    case AppErrorCodes.ACCOUNT_ALREADY_VALIDATED:
      return HttpStatuses.BAD_REQUEST;
    case AppErrorCodes.FAILED_TO_SEND_EMAIL:
      return HttpStatuses.INTERNAL_SERVER_ERROR;
    case AppErrorCodes.CURRENT_USER_NOT_FOUND:
    case AppErrorCodes.TOKEN_NOT_FOUND:
    case AppErrorCodes.INVALID_TOKEN:
    case AppErrorCodes.INVALID_JWT_TOKEN:
    case AppErrorCodes.TOKEN_EXPIRED:
      return HttpStatuses.UNAUTHORIZED;
    case AppErrorCodes.CURRENT_USER_NOT_ALLOWED:
    case AppErrorCodes.TOKEN_TYPE_MISMATCH:
    case AppErrorCodes.TOKEN_USER_ID_MISMATCH:
      return HttpStatuses.FORBIDDEN;
    default:
      return HttpStatuses.INTERNAL_SERVER_ERROR;
  }
};
