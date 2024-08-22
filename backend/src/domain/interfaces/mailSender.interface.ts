export interface SendResetPasswordEmailOptions {
  email: string;
  tokenValue: string;
}

export interface MailSenderInterface {
  sendResetPasswordEmail: (options: SendResetPasswordEmailOptions) => Promise<void>;
}
