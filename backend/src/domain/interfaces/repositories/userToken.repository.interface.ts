import {
  UserTokenInterface,
  UserTokenType,
} from '@/domain/entities/userToken/userToken.entity.interface';

export interface UpdateTokenOptions {
  oldTokenValue: string;
  newTokenValue: string;
  expirationDate: Date;
}

export interface DeleteByOptions {
  tokenType?: string;
  exceptTokenValue?: string;
}

export interface UserTokenRepositoryInterface {
  create: (token: UserTokenInterface) => Promise<void>;
  findByTokenValue: (tokenValue: string) => Promise<UserTokenInterface | null>;
  deleteByUser: (userId: string, options?: DeleteByOptions) => Promise<void>;
  deleteByValue: (tokenValue: string) => Promise<void>;
  deleteUserTokens: (userId: string, tokenTypes?: UserTokenType[]) => Promise<void>;
  update: (options: UpdateTokenOptions) => Promise<void>;
}
