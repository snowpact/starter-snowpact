export interface SendResetPasswordEmailOptions {
  email: string;
  token: string;
}

export interface MailSenderInterface {
  sendResetPasswordEmail: (options: SendResetPasswordEmailOptions) => Promise<void>;
}
