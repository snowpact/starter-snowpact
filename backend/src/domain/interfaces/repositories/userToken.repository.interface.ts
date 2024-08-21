import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';

export interface UpdateOptions {
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
  delete: (tokenValue: string) => Promise<void>;
  update: (options: UpdateOptions) => Promise<void>;
}
