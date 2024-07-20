export interface SendResetPasswordEmailOptions {
  email: string;
  token: string;
}

export interface SendResetPasswordEmailServiceInterface {
  sendResetPasswordEmail: (options: SendResetPasswordEmailOptions) => Promise<void>;
}
