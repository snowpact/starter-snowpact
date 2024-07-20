export interface LoginUseCaseInterface {
  executeLogin: (
    email: string,
    password: string,
  ) => Promise<{ accessToken: string; refreshToken: string }>;
}
