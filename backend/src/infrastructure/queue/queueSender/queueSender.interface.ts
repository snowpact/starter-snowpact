export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export interface QueueSenderInterface {
  sendEmail(options: SendEmailOptions): Promise<void>;
}
