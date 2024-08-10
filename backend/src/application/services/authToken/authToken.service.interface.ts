export interface UserPayloadOptions {
  userId: string;
}

export interface AuthServiceInterface {
  generateAccessToken: (userId: string) => Promise<string>;
  generateRefreshToken: (userId: string) => Promise<string>;
  verifyAccessToken: (token: string, withExpiration?: boolean) => Promise<UserPayloadOptions>;
  refreshToken: (token: string) => Promise<string>;
}
