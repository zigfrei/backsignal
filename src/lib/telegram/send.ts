import 'server-only';

type TelegramResult = { ok: true; messageId: string } | { ok: false; code: string; retryAfter?: number };

export async function sendTelegramMessage(chatId: string, text: string): Promise<TelegramResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, code: 'not_configured' };
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, link_preview_options: { is_disabled: true } }),
      signal: AbortSignal.timeout(8000),
    });
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') return { ok: false, code: 'invalid_response' };
    if ('ok' in data && data.ok === true && 'result' in data && data.result && typeof data.result === 'object' && 'message_id' in data.result) {
      return { ok: true, messageId: String(data.result.message_id) };
    }
    const retryAfter = 'parameters' in data && data.parameters && typeof data.parameters === 'object' && 'retry_after' in data.parameters && typeof data.parameters.retry_after === 'number' ? data.parameters.retry_after : undefined;
    return { ok: false, code: response.status === 403 ? 'blocked' : response.status === 429 ? 'rate_limited' : `http_${response.status}`, retryAfter };
  } catch {
    // A timeout may occur after Telegram accepted the message; do not blindly retry.
    return { ok: false, code: 'uncertain_transport' };
  }
}
