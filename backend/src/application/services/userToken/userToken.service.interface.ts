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
  token: UserTokenInterface | null;
  tokenValue: string;
  ignoreExpiration?: boolean;
  tokenType: UserTokenType;
  userId?: string;
}

export interface UserTokenServiceInterface {
  generateToken(options: GenerateTokenOptions): UserTokenInterface;
  verifyToken(options: VerifyTokenOptions): UserTokenInterface;
}
