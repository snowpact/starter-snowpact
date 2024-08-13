export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface MailerInterface {
  sendMail: (options: SendEmailOptions) => Promise<void>;
}
