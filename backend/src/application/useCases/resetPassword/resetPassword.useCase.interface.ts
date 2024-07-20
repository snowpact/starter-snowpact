export interface ResetPasswordUseCaseInterface {
  executeAskResetPassword: (email: string) => Promise<void>;
  executeResetPassword: (token: string, newPassword: string) => Promise<void>;
}
