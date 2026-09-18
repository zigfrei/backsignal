import { z } from 'zod';

export const moods = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'] as const;
export const feedbackMoodSchema = z.enum(moods).nullish().transform((value) => value ?? 'NEUTRAL');
export const feedbackSchema = z.object({
  publicId: z.uuid(),
  submissionId: z.uuid(),
  text: z.string().trim().min(10).max(3000),
  mood: feedbackMoodSchema,
  locale: z.enum(['ru', 'en']),
  website: z.string().max(200).default(''),
});

export function selectFeedbackLocale(cookie: string | undefined, objectLocale: string | undefined, acceptLanguage: string | null): 'ru' | 'en' {
  if (cookie === 'ru' || cookie === 'en') return cookie;
  if (objectLocale === 'ru' || objectLocale === 'en') return objectLocale;
  const candidates = (acceptLanguage ?? '').split(',').map((entry) => {
    const [tag, quality] = entry.trim().split(';');
    const q = quality ? Number(quality.trim().replace(/^q=/, '')) : 1;
    return { locale: tag.toLowerCase().split('-')[0], q: Number.isFinite(q) ? q : 0 };
  }).sort((a, b) => b.q - a.q);
  return candidates.find((entry) => entry.q > 0 && (entry.locale === 'ru' || entry.locale === 'en'))?.locale === 'en' ? 'en' : 'ru';
}
