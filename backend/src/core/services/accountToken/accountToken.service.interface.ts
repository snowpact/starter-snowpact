import { TokenTypeEnum } from '@/infrastructure/services/stateFullToken/token/token.interface';

export enum AccountTokenType {
  VERIFY_ACCOUNT = 'verify-account',
  RESET_PASSWORD = 'reset-password',
}

export interface GenerateAccountTokenOptions {
  userId: string;
  tokenType: TokenTypeEnum;
}

export interface VerifyTokenOptions {
  tokenValue: string;
  tokenType: TokenTypeEnum;
}

export interface AccountTokenServiceInterface {
  generateAccountToken: (options: GenerateAccountTokenOptions) => Promise<string>;
  verifyAccountToken: (options: VerifyTokenOptions) => Promise<string>;
  deleteAccountToken: (token: string) => Promise<void>;
}
