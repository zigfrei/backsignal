import assert from 'node:assert/strict';
import { test } from 'node:test';
import { feedbackSchema, feedbackMoodSchema, selectFeedbackLocale } from '../src/lib/public-feedback-schema.ts';

const valid = {
  publicId: '123e4567-e89b-42d3-a456-426614174000',
  submissionId: '123e4567-e89b-42d3-a456-426614174001',
  text: '  Очень понравилось обслуживание!  ',
  locale: 'ru',
};

test('feedback defaults to neutral and normalizes text', () => {
  const parsed = feedbackSchema.parse(valid);
  assert.equal(parsed.mood, 'NEUTRAL');
  assert.equal(parsed.text, valid.text.trim());
  assert.equal(parsed.website, '');
});

test('unselected radio group (null) is accepted as neutral on client and server', () => {
  assert.equal(feedbackMoodSchema.parse(null), 'NEUTRAL');
  assert.equal(feedbackMoodSchema.parse(undefined), 'NEUTRAL');
  assert.equal(feedbackSchema.parse({ ...valid, mood: null }).mood, 'NEUTRAL');
  assert.equal(feedbackMoodSchema.parse('POSITIVE'), 'POSITIVE');
  assert.equal(feedbackMoodSchema.parse('NEGATIVE'), 'NEGATIVE');
});

test('validates moods, identifiers, languages and message length', () => {
  for (const mood of ['POSITIVE', 'NEUTRAL', 'NEGATIVE']) {
    assert.equal(feedbackSchema.parse({ ...valid, mood }).mood, mood);
  }
  for (const patch of [{ text: 'short' }, { text: 'a'.repeat(3001) }, { mood: 'UNKNOWN' }, { locale: 'de' }, { publicId: '../test' }, { submissionId: '' }]) {
    assert.equal(feedbackSchema.safeParse({ ...valid, ...patch }).success, false);
  }
  assert.equal(feedbackSchema.safeParse({ ...valid, text: 'a'.repeat(3000) }).success, true);
});

test('language priority is cookie, object, browser, Russian', () => {
  assert.equal(selectFeedbackLocale('en', 'ru', 'ru'), 'en');
  assert.equal(selectFeedbackLocale(undefined, 'en', 'ru'), 'en');
  assert.equal(selectFeedbackLocale('bad', 'bad', 'ru;q=0.2,en-US;q=0.9'), 'en');
  assert.equal(selectFeedbackLocale(undefined, undefined, 'en;q=0,ru;q=1'), 'ru');
  assert.equal(selectFeedbackLocale(undefined, undefined, 'de'), 'ru');
});
