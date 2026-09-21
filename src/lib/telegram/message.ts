export function createTelegramFeedbackText({ locale, name, text, mood, origin, messageId }: {
  locale: string;
  name: string;
  text: string;
  mood: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  origin: string;
  messageId: string;
}) {
  const en = locale === 'en';
  const moodEmoji = { POSITIVE: '🙂', NEUTRAL: '😐', NEGATIVE: '😞' }[mood];
  const url = `${origin}${en ? '/en' : ''}/dashboard?message=${encodeURIComponent(messageId)}`;
  const title = en ? `New feedback for “${name}”` : `Новый обратный сигнал для «${name}»`;
  const action = en ? 'Open message' : 'Открыть сообщение';
  return `${title} ${moodEmoji}\n\n${text}\n\n${action}: ${url}`;
}
