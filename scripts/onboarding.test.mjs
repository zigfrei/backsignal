import assert from 'node:assert/strict';
import { test } from 'node:test';
import QRCode from 'qrcode';
import { onboardingSchema } from '../src/lib/onboarding-schema.ts';

test('onboarding name validation and normalization', () => {
  assert.equal(onboardingSchema.parse({ name: '  Кофейня Зёрно  ' }).name, 'Кофейня Зёрно');
  for (const name of ['', ' ', 'A', 'a'.repeat(101), 'Test\nName', 'Test\u0000Name']) {
    assert.equal(onboardingSchema.safeParse({ name }).success, false);
  }
  assert.equal(onboardingSchema.safeParse({ name: 'a'.repeat(100) }).success, true);
  assert.equal(onboardingSchema.safeParse({ name: 123 }).success, false);
  assert.equal(onboardingSchema.safeParse(null).success, false);
});

test('a QR code can be generated for the permanent public URL', async () => {
  const url = 'https://backsignal.tech/q/123e4567-e89b-12d3-a456-426614174000';
  const svg = await QRCode.toString(url, { type: 'svg', margin: 4, errorCorrectionLevel: 'M' });
  assert.match(svg, /<svg/);
  assert.match(svg, /<path/);
});
