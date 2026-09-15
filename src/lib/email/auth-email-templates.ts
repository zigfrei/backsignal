import 'server-only';

import type { Locale } from '@/i18n/routing';

interface AuthEmailTemplate {
  subject: string;
  text: string;
  html: string;
}

interface AuthEmailTemplateOptions {
  locale: Locale;
  name: string;
  url: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createEmailHtml({
  title,
  greeting,
  description,
  action,
  url,
  note,
}: {
  title: string;
  greeting: string;
  description: string;
  action: string;
  url: string;
  note: string;
}) {
  return `<!doctype html>
<html>
  <body style="margin:0;background:#f5f9f8;color:#0f2d2e;font-family:Arial,sans-serif">
    <div style="max-width:560px;margin:0 auto;padding:40px 20px">
      <div style="border:1px solid #e6e9eb;border-radius:12px;background:#ffffff;padding:32px">
        <p style="margin:0 0 24px;color:#16a085;font-weight:700">Backsignal</p>
        <h1 style="margin:0 0 16px;font-size:28px;line-height:1.25">${title}</h1>
        <p style="margin:0 0 12px">${greeting}</p>
        <p style="margin:0 0 24px;line-height:1.5">${description}</p>
        <a href="${escapeHtml(url)}" style="display:inline-block;border-radius:8px;background:#16a085;color:#ffffff;padding:12px 20px;text-decoration:none;font-weight:600">${action}</a>
        <p style="margin:24px 0 0;color:#475569;font-size:14px;line-height:1.5">${note}</p>
      </div>
    </div>
  </body>
</html>`;
}

export function createVerificationEmail({
  locale,
  name,
  url,
}: AuthEmailTemplateOptions): AuthEmailTemplate {
  const safeName = escapeHtml(name);

  if (locale === 'en') {
    const subject = 'Confirm your Backsignal email';
    const description = 'Confirm your email address to finish creating your account.';

    return {
      subject,
      text: `Hello, ${name}! ${description}\n\n${url}\n\nThe link is valid for 1 hour.`,
      html: createEmailHtml({
        title: 'Confirm your email',
        greeting: `Hello, ${safeName}!`,
        description,
        action: 'Confirm email',
        url,
        note: 'The link is valid for 1 hour. If you did not create an account, ignore this email.',
      }),
    };
  }

  const subject = 'Подтвердите почту в Backsignal';
  const description = 'Подтвердите адрес электронной почты, чтобы завершить создание аккаунта.';

  return {
    subject,
    text: `Здравствуйте, ${name}! ${description}\n\n${url}\n\nСсылка действует 1 час.`,
    html: createEmailHtml({
      title: 'Подтвердите почту',
      greeting: `Здравствуйте, ${safeName}!`,
      description,
      action: 'Подтвердить почту',
      url,
      note: 'Ссылка действует 1 час. Если вы не создавали аккаунт, проигнорируйте это письмо.',
    }),
  };
}

export function createResetPasswordEmail({
  locale,
  name,
  url,
}: AuthEmailTemplateOptions): AuthEmailTemplate {
  const safeName = escapeHtml(name);

  if (locale === 'en') {
    const subject = 'Reset your Backsignal password';
    const description = 'We received a request to reset the password for your account.';

    return {
      subject,
      text: `Hello, ${name}! ${description}\n\n${url}\n\nThe link is valid for 1 hour.`,
      html: createEmailHtml({
        title: 'Reset your password',
        greeting: `Hello, ${safeName}!`,
        description,
        action: 'Set a new password',
        url,
        note: 'The link is valid for 1 hour. If you did not request a password reset, ignore this email.',
      }),
    };
  }

  const subject = 'Восстановление пароля Backsignal';
  const description = 'Мы получили запрос на восстановление пароля вашего аккаунта.';

  return {
    subject,
    text: `Здравствуйте, ${name}! ${description}\n\n${url}\n\nСсылка действует 1 час.`,
    html: createEmailHtml({
      title: 'Восстановление пароля',
      greeting: `Здравствуйте, ${safeName}!`,
      description,
      action: 'Установить новый пароль',
      url,
      note: 'Ссылка действует 1 час. Если вы не запрашивали восстановление пароля, проигнорируйте это письмо.',
    }),
  };
}
