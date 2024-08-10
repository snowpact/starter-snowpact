import { TokenInterface } from '@/infrastructure/services/stateFullToken/token/token.interface';

export interface UpdateOptions {
  oldTokenValue: string;
  newTokenValue: string;
  expirationDate: Date;
}

export interface TokenRepositoryInterface {
  create: (token: TokenInterface) => Promise<void>;
  findByTokenValue: (tokenValue: string) => Promise<TokenInterface | undefined>;
  delete: (tokenValue: string) => Promise<void>;
  update: (options: UpdateOptions) => Promise<void>;
}
