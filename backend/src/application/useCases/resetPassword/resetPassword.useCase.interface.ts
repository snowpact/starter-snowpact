export interface ResetPasswordUseCaseInterface {
  executeResetPasswordRequest: (email: string) => Promise<void>;
  executeResetPassword: (token: string, newPassword: string) => Promise<void>;
}
