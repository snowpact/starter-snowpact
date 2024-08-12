export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface MailerServiceInterface {
  sendMail: (options: SendEmailOptions) => Promise<void>;
}
