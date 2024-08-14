import {
  UserTokenType,
  UserTokenInterface,
} from '@/domain/entities/userToken/userToken.entity.interface';

export interface GenerateTokenOptions {
  userId: string;
  expiresIn: number;
  canBeRefreshed: boolean;
  tokenType: UserTokenType;
}

export interface VerifyTokenOptions {
  tokenValue: string;
  ignoreExpiration?: boolean;
  tokenType: UserTokenType;
  userId?: string;
}

export interface RefreshTokenOptions {
  tokenValue: string;
  expiresIn: number;
}

export interface UserTokenServiceInterface {
  generateToken(options: GenerateTokenOptions): Promise<string>;
  removeToken(tokenValue: string): Promise<void>;
  verifyToken(options: VerifyTokenOptions): Promise<UserTokenInterface>;
  refreshToken(options: RefreshTokenOptions): Promise<string>;
}
