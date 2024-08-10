export interface UserPayloadOptions {
  userId: string;
}

export interface AuthServiceInterface {
  generateAccessToken: (payload: UserPayloadOptions) => Promise<string>;
  generateRefreshToken: (payload: UserPayloadOptions) => Promise<string>;
  verifyAccessToken: (token: string, withExpiration?: boolean) => Promise<UserPayloadOptions>;
  verifyRefreshToken: (token: string, withExpiration?: boolean) => Promise<UserPayloadOptions>;
}
