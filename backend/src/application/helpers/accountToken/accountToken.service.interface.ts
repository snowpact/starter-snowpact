export enum AccountTokenType {
  VERIFY_ACCOUNT = 'verify-account',
  RESET_PASSWORD = 'reset-password',
}

export interface UserPayloadOptions {
  userId: string;
  type: AccountTokenType;
}

export interface AccountTokenServiceInterface {
  generateAccountToken: (userPayload: UserPayloadOptions) => Promise<string>;
  verifyAccountToken: (token: string, withExpiration?: boolean) => Promise<UserPayloadOptions>;
}
