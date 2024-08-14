import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZodError } from 'zod';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { AppError } from '@/application/errors/app.error';
import { Logger } from '@/gateways/logger/logger';

import { appErrorMiddleware, getStatusCodeFromErrorCode } from './appError.middleware';
import { HttpStatuses } from '../../config/httpStatuses';
import { CustomEnvInterface } from '../../loader/getHonoApp';

vi.mock('@/gateways/logger/logger');

describe('appErrorMiddleware', () => {
  let mockContext: Context<CustomEnvInterface>;

  beforeEach(() => {
    mockContext = {
      json: vi.fn().mockReturnThis(),
    } as unknown as Context<CustomEnvInterface>;
  });

  it('should handle AppError correctly', async () => {
    const appError = new AppError({
      message: 'Test error',
      code: AppErrorCodes.USER_NOT_FOUND,
      context: { userId: '123' },
    });
    await appErrorMiddleware(appError, mockContext);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: 'Test error',
        code: AppErrorCodes.USER_NOT_FOUND,
        context: { userId: '123' },
      },
      HttpStatuses.NOT_FOUND,
    );
  });

  it('should handle HTTPException correctly', async () => {
    const httpException = new HTTPException(400, { message: 'Bad Request' });
    const mockResponse = { status: 400, headers: {}, body: 'Bad Request' };
    httpException.getResponse = vi.fn().mockReturnValue(mockResponse);

    const result = await appErrorMiddleware(httpException, mockContext);

    expect(result).toEqual(mockResponse);
  });

  it('should handle ZodError correctly', async () => {
    const zodError = new ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        received: 'number',
        path: ['name'],
        message: 'Expected string, received number',
      },
    ]);
    await appErrorMiddleware(zodError, mockContext);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: 'Invalid request body',
        statusCode: HttpStatuses.BAD_REQUEST,
        code: 'invalid_request_body',
        context: zodError.errors,
      },
      HttpStatuses.BAD_REQUEST,
    );
  });

  it('should handle generic error correctly', async () => {
    const genericError = new Error('Generic error');
    await appErrorMiddleware(genericError, mockContext);

    expect(Logger.prototype.error).toHaveBeenCalledWith('Generic error', genericError);
    expect(mockContext.json).toHaveBeenCalledWith(
      {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
      },
      HttpStatuses.INTERNAL_SERVER_ERROR,
    );
  });
});

describe('getStatusCodeFromErrorCode', () => {
  it.each([
    [AppErrorCodes.USER_NOT_FOUND, HttpStatuses.NOT_FOUND],
    [AppErrorCodes.INVALID_DATA_PROVIDED, HttpStatuses.BAD_REQUEST],
    [AppErrorCodes.BAD_PASSWORD, HttpStatuses.BAD_REQUEST],
    [AppErrorCodes.INVALID_PASSWORD_COMPLEXITY, HttpStatuses.BAD_REQUEST],
    [AppErrorCodes.FAILED_TO_SEND_EMAIL, HttpStatuses.INTERNAL_SERVER_ERROR],
    [AppErrorCodes.CURRENT_USER_NOT_FOUND, HttpStatuses.UNAUTHORIZED],
    [AppErrorCodes.TOKEN_NOT_FOUND, HttpStatuses.UNAUTHORIZED],
    [AppErrorCodes.INVALID_TOKEN, HttpStatuses.UNAUTHORIZED],
    [AppErrorCodes.INVALID_JWT_TOKEN, HttpStatuses.UNAUTHORIZED],
    [AppErrorCodes.TOKEN_EXPIRED, HttpStatuses.UNAUTHORIZED],
    [AppErrorCodes.CURRENT_USER_NOT_ALLOWED, HttpStatuses.FORBIDDEN],
    [AppErrorCodes.TOKEN_TYPE_MISMATCH, HttpStatuses.FORBIDDEN],
    [AppErrorCodes.TOKEN_USER_ID_MISMATCH, HttpStatuses.FORBIDDEN],
    ['UNKNOWN_ERROR', HttpStatuses.INTERNAL_SERVER_ERROR],
  ])('should return correct status code for error code %s', (errorCode, expectedStatusCode) => {
    expect(getStatusCodeFromErrorCode(errorCode)).toBe(expectedStatusCode);
  });
});
