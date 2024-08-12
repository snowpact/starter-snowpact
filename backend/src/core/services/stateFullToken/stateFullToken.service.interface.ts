import { TokenType, TokenInterface } from '@/core/entities/token/token.interface';

export interface GenerateTokenOptions {
  userId: string;
  expiresIn: number;
  canBeRefreshed: boolean;
  tokenType: TokenType;
}

export interface VerifyTokenOptions {
  tokenValue: string;
  ignoreExpiration?: boolean;
  tokenType: TokenType;
  userId?: string;
}

export interface RefreshTokenOptions {
  tokenValue: string;
  expiresIn: number;
}

export interface StateFullTokenServiceInterface {
  generateToken(options: GenerateTokenOptions): Promise<string>;
  removeToken(tokenValue: string): Promise<void>;
  verifyToken(options: VerifyTokenOptions): Promise<TokenInterface>;
  refreshToken(options: RefreshTokenOptions): Promise<string>;
}
