export interface EmailMessage {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  idempotencyKey?: string;
}

export interface EmailSendResult {
  id: string;
}

export interface EmailSender {
  send(message: EmailMessage): Promise<EmailSendResult>;
}

export class EmailDeliveryError extends Error {
  constructor(public readonly code: string, public readonly retryable: boolean, public readonly uncertain: boolean = false) {
    super(`Email delivery failed: ${code}`);
  }
}
