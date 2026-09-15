import 'server-only';

import { ResendEmailSender } from './resend-email-sender';
import type { EmailMessage, EmailSender, EmailSendResult } from './types';

type AuthEmailMessage = Omit<EmailMessage, 'from' | 'replyTo'> & {
  replyTo?: string;
};

let emailSender: EmailSender | undefined;

function getRequiredEnvironmentVariable(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
}

function getEmailSender(): EmailSender {
  if (emailSender) {
    return emailSender;
  }

  const provider = process.env.EMAIL_PROVIDER ?? 'resend';

  if (provider !== 'resend') {
    throw new Error(`Unsupported email provider: ${provider}`);
  }

  emailSender = new ResendEmailSender(
    getRequiredEnvironmentVariable('RESEND_API_KEY'),
  );

  return emailSender;
}

export function sendEmail(message: EmailMessage): Promise<EmailSendResult> {
  return getEmailSender().send(message);
}

export function sendAuthEmail(
  message: AuthEmailMessage,
): Promise<EmailSendResult> {
  const defaultReplyTo = process.env.EMAIL_REPLY_TO || undefined;

  return sendEmail({
    ...message,
    from: getRequiredEnvironmentVariable('AUTH_EMAIL_FROM'),
    replyTo: message.replyTo ?? defaultReplyTo,
  });
}

export type { EmailMessage, EmailSender, EmailSendResult } from './types';
