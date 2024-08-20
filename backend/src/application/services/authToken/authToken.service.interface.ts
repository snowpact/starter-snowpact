export interface UserPayloadOptions {
  userId: string;
}

export interface AuthServiceInterface {
  generateAccessToken: (userId: string) => Promise<string>;
  generateRefreshToken: (userId: string) => Promise<string>;
  verifyAccessToken: (token: string, ignoreExpiration?: boolean) => Promise<UserPayloadOptions>;
  refreshToken: (token: string, userId: string) => Promise<string>;
}
