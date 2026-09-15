import 'server-only';

import { Resend } from 'resend';

import type {
  EmailMessage,
  EmailSender,
  EmailSendResult,
} from './types';

export class ResendEmailSender implements EmailSender {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const { data, error } = await this.client.emails.send(message);

    if (error) {
      throw new Error(`Resend failed to send email: ${error.message}`);
    }

    if (!data) {
      throw new Error('Resend did not return an email id');
    }

    return { id: data.id };
  }
}
