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
  const moodNames = en
    ? { POSITIVE: 'Positive', NEUTRAL: 'Neutral', NEGATIVE: 'Negative' }
    : { POSITIVE: 'Положительное', NEUTRAL: 'Нейтральное', NEGATIVE: 'Отрицательное' };
  const moodLabel = `${en ? 'Sender’s mood' : 'Настроение отправителя'}: ${moodNames[mood]} ${moodEmoji}`;
  const url = `${origin}${en ? '/en' : ''}/dashboard?message=${encodeURIComponent(messageId)}`;
  const title = en ? `New feedback for “${name}”` : `Новый обратный сигнал для «${name}»`;
  const action = en ? 'Open message' : 'Открыть сообщение';
  return `${title}\n${moodLabel}\n\n${text}\n\n${action}: ${url}`;
}
