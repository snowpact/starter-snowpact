import { OpenAPIHono } from '@hono/zod-openapi';
import { describe, it, expect, beforeEach } from 'vitest';

import { AppErrorCodes } from '@/application/errors/app.error.interface';

import { appErrorMiddleware } from './appError.middleware';
import { AppError } from '../../../../application/errors/app.error';

describe('appErrorMiddleware', () => {
  let app: OpenAPIHono;

  beforeEach(() => {
    app = new OpenAPIHono();
  });

  it('should handle AppError and return the correct response', async () => {
    app.get('/test', () => {
      throw new AppError({ message: 'User not found', code: AppErrorCodes.USER_NOT_FOUND });
    });

    app.onError(appErrorMiddleware);

    const res = await app.request('/test', { method: 'GET' });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      message: 'User not found',
      code: AppErrorCodes.USER_NOT_FOUND,
    });
  });

  it('should handle unknown errors and return a generic response', async () => {
    app.get('/test', () => {
      throw new Error('Unknown error');
    });
    app.onError(appErrorMiddleware);

    const res = await app.request('/test', { method: 'GET' });
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    });
  });

  it('should call next without errors', async () => {
    app.get('/test', (c) => {
      return c.json({ message: 'Hello, world!' });
    });
    app.onError(appErrorMiddleware);
    const res = await app.request('/test', { method: 'GET' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: 'Hello, world!',
    });
  });
});
