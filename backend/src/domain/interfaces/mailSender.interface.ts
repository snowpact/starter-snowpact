export interface SendResetPasswordEmailOptions {
  email: string;
  tokenValue: string;
}

export interface SendRegisterEmailOptions {
  email: string;
  tokenValue: string;
}

export interface MailSenderInterface {
  sendResetPasswordEmail: (options: SendResetPasswordEmailOptions) => Promise<void>;
  sendRegisterEmail: (options: SendRegisterEmailOptions) => Promise<void>;
}
