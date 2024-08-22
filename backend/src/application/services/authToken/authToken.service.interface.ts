import { UserTokenInterface } from '@/domain/entities/userToken/userToken.entity.interface';

export interface UserPayloadOptions {
  userId: string;
}

export interface VerifyRefreshTokenOptions {
  token: UserTokenInterface | null;
  tokenValue: string;
  userId: string;
}

export interface AuthServiceInterface {
  generateAccessToken: (userId: string) => Promise<string>;
  generateRefreshToken: (userId: string) => UserTokenInterface;
  verifyAccessToken: (token: string, ignoreExpiration?: boolean) => Promise<UserPayloadOptions>;
  verifyRefreshToken: (options: VerifyRefreshTokenOptions) => UserTokenInterface;
}
