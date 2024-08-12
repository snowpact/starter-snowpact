import { AppErrorInterface } from './app.error.interface';

export const isAppError = (error: unknown): error is AppErrorInterface => {
  if (error instanceof Error) {
    return 'isAppError' in error;
  }
  return false;
};
