import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function load(filename) {
  const source = (await readFile(new URL(`../src/lib/email/${filename}.ts`, import.meta.url), 'utf8')).replace("import 'server-only';", '');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
const { createFeedbackEmail } = await load('feedback-email-template');
const { retryNotification } = await load('notification-policy');
const { createVerificationEmail } = await load('auth-email-templates');

test('Yandex verification explains notifications without blocking dashboard access', () => {
  for (const locale of ['ru', 'en']) {
    const email = createVerificationEmail({ locale, name: '<User>', url: 'https://backsignal.tech/api/auth/verify-email?token=test', notificationOnly: true });
    assert.ok(email.text.includes(locale === 'ru' ? 'уведомления о новых сообщениях' : 'notifications about new customer messages'));
    assert.ok(email.html.includes('&lt;User&gt;'));
    assert.ok(email.html.includes('token=test'));
    const passwordEmail = createVerificationEmail({ locale, name: 'User', url: 'https://backsignal.tech/api/auth/verify-email?token=test' });
    assert.ok(passwordEmail.text.includes(locale === 'ru' ? 'завершить создание аккаунта' : 'finish creating your account'));
  }
});
const base = { name: '<script>Shop</script>', text: '<img src=x> & feedback', mood: 'NEUTRAL', origin: 'https://stage.backsignal.tech', messageId: 'message-id', stage: true };

test('RU email escapes untrusted data and links to its own environment', () => {
  const email = createFeedbackEmail({ ...base, locale: 'ru' });
  assert.ok(email.subject.startsWith('Новый обратный сигнал'));
  assert.ok(!email.subject.includes('[STAGE]'));
  assert.ok(email.text.includes('Настроение отправителя: Нейтральное 😐'));
  assert.ok(email.html.includes('Настроение отправителя: Нейтральное 😐'));
  assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(email.html.includes('&lt;img src=x&gt; &amp;'));
  assert.ok(!email.html.includes('<script>'));
  assert.ok(email.text.includes('https://stage.backsignal.tech/dashboard?message=message-id'));
});
test('EN email uses localized protected dashboard, bounded preview and settings', () => {
  const email = createFeedbackEmail({ ...base, locale: 'en', stage: false, text: 'x'.repeat(1000) });
  assert.ok(email.subject.startsWith('New feedback'));
  assert.ok(email.text.includes('Sender’s mood: Neutral 😐'));
  assert.ok(email.text.includes('/en/dashboard?message=message-id'));
  assert.ok(email.text.includes('/en/dashboard/settings'));
  assert.ok(!email.text.includes('x'.repeat(301)));
});
test('ambiguous attempts are not blindly retried beyond provider deduplication window', () => {
  const firstAttemptAt = new Date('2026-09-18T08:00:00Z');
  assert.equal(retryNotification({ attempts: 1, uncertain: true, firstAttemptAt, now: new Date('2026-09-19T08:00:00Z') }), false);
  assert.equal(retryNotification({ attempts: 1, uncertain: true, firstAttemptAt, now: new Date('2026-09-18T09:00:00Z') }), true);
  assert.equal(retryNotification({ attempts: 1, uncertain: false, firstAttemptAt, now: new Date('2026-09-19T08:00:00Z') }), true);
  assert.equal(retryNotification({ attempts: 5, uncertain: false, firstAttemptAt, now: firstAttemptAt }), false);
});
