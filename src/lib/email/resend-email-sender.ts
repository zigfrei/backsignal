import 'server-only';

import { Resend } from 'resend';
import { EmailDeliveryError } from './types';

import type {
  EmailMessage,
  EmailSender,
  EmailSendResult,
} from './types';

class TimedResend extends Resend {
  override fetchRequest<T>(path: string, options = {}) {
    return super.fetchRequest<T>(path, { ...options, signal: AbortSignal.timeout(15_000) });
  }
}

export class ResendEmailSender implements EmailSender {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new TimedResend(apiKey);
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    const { idempotencyKey, ...payload } = message;
    const { data, error } = await this.client.emails.send(payload, idempotencyKey ? { idempotencyKey } : undefined);

    if (error) {
      const status = error.statusCode;
      const ambiguous = status === null || status === undefined || status >= 500;
      throw new EmailDeliveryError(error.name || (status ? `http_${status}` : 'provider_error'), status === 429 || ambiguous, ambiguous);
    }

    if (!data) {
      throw new EmailDeliveryError('missing_response', true, true);
    }

    return { id: data.id };
  }
}
