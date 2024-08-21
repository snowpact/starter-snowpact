export interface RefreshUseCaseInterface {
  executeRefresh: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<{ accessToken: string; refreshToken: string }>;
}
