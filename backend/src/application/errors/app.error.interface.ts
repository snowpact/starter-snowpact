export enum AppErrorCodes {
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CURRENT_USER_NOT_FOUND = 'CURRENT_USER_NOT_FOUND',
  CURRENT_USER_NOT_ALLOWED = 'CURRENT_USER_NOT_ALLOWED',
  EMAIL_ALREADY_TAKEN = 'EMAIL_ALREADY_TAKEN',
  ACCOUNT_ALREADY_VALIDATED = 'ACCOUNT_ALREADY_VALIDATED',

  INVALID_DATA_PROVIDED = 'INVALID_DATA_PROVIDED',
  INVALID_PASSWORD_COMPLEXITY = 'INVALID_PASSWORD_COMPLEXITY',
  BAD_PASSWORD = 'BAD_PASSWORD',

  FAILED_TO_SEND_EMAIL = 'FAILED_TO_SEND_EMAIL',

  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_JWT_TOKEN = 'INVALID_JWT_TOKEN',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_TYPE_MISMATCH = 'TOKEN_TYPE_MISMATCH',
  TOKEN_USER_ID_MISMATCH = 'TOKEN_USER_ID_MISMATCH',
}

export interface AppErrorOptions {
  message: string;
  code: AppErrorCodes;
  context?: unknown;
  privateContext?: unknown;
  error?: unknown;
  silent?: boolean;
}

export interface AppErrorInterface extends Error {
  message: string;
  code: AppErrorCodes;
  context?: unknown;
  isAppError: boolean;
  error?: unknown;
  silent?: boolean;
}
