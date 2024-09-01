export interface ResendValidationEmailUseCaseInterface {
  executeResendValidationEmail: (params: { email?: string; token?: string }) => Promise<void>;
}
