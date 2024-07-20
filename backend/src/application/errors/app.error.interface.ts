export enum AppErrorCodes {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CURRENT_USER_NOT_FOUND = 'CURRENT_USER_NOT_FOUND',
  CURRENT_USER_NOT_ALLOWED = 'CURRENT_USER_NOT_ALLOWED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  BAD_PASSWORD = 'BAD_PASSWORD',
  FAILED_TO_SEND_EMAIL = 'FAILED_TO_SEND_EMAIL',
  INVALID_DATA_PROVIDED = 'INVALID_DATA_PROVIDED',
}

export interface AppErrorOptions {
  message: string;
  code: AppErrorCodes;
  context?: unknown;
}

export interface AppErrorInterface extends Error {
  message: string;
  code: AppErrorCodes;
  context?: unknown;
  isAppError: boolean;
}
