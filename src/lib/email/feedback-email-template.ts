function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function createFeedbackEmail({
  locale,
  name,
  text,
  mood,
  origin,
  messageId,
}: {
  locale: string;
  name: string;
  text: string;
  mood: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  origin: string;
  messageId: string;
}) {
  const en = locale === 'en';
  const path = en ? '/en/dashboard' : '/dashboard';
  const url = `${origin}${path}?message=${encodeURIComponent(messageId)}`;
  const settingsUrl = `${origin}${path}/settings`;
  const title = en
    ? `New feedback for “${name}”`
    : `Новый обратный сигнал для «${name}»`;
  const moods = en
    ? { POSITIVE: 'Positive', NEUTRAL: 'Neutral', NEGATIVE: 'Negative' }
    : {
        POSITIVE: 'Положительное',
        NEUTRAL: 'Нейтральное',
        NEGATIVE: 'Отрицательное',
      };
  const moodEmoji = { POSITIVE: '🙂', NEUTRAL: '😐', NEGATIVE: '😞' };
  const moodLabel = `${en ? 'Sender’s mood' : 'Настроение отправителя'}: ${moods[mood]} ${moodEmoji[mood]}`;
  const preview =
    Array.from(text.replace(/\s+/g, ' ')).slice(0, 300).join('') +
    (Array.from(text.replace(/\s+/g, ' ')).length > 300 ? '…' : '');
  const action = en ? 'Open message' : 'Открыть сообщение';
  const note = en
    ? 'You receive this email because feedback notifications are enabled.'
    : 'Вы получаете письмо, потому что включены уведомления о новых сообщениях.';
  const settings = en ? 'Notification settings' : 'Настроить уведомления';
  return {
    subject: title.replace(/[\r\n]/g, ' '),
    text: `${title}\n${moodLabel}\n\n${preview}\n\n${action}: ${url}\n\n${note}\n${settings}: ${settingsUrl}`,
    html: `<!doctype html><html><body style="background:#f5f9f8;color:#0f2d2e;font-family:Arial,sans-serif"><div style="max-width:560px;margin:auto;padding:32px"><h1 style="font-size:24px">${escapeHtml(title)}</h1><p>${escapeHtml(moodLabel)}</p><p style="line-height:1.5">${escapeHtml(preview)}</p><a href="${escapeHtml(url)}" style="display:inline-block;background:#16a085;color:white;padding:12px 20px;border-radius:8px">${action}</a><p style="font-size:14px;color:#475569">${note}</p><a href="${escapeHtml(settingsUrl)}">${settings}</a></div></body></html>`,
  };
}
