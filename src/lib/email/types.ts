export interface EmailMessage {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  id: string;
}

export interface EmailSender {
  send(message: EmailMessage): Promise<EmailSendResult>;
}
