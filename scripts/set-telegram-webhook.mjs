import 'dotenv/config';

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const username = process.env.TELEGRAM_BOT_USERNAME;

if (!token || !secret || !appUrl || !username) {
  console.error('TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME, TELEGRAM_WEBHOOK_SECRET and NEXT_PUBLIC_APP_URL are required.');
  process.exitCode = 1;
} else {
  const origin = new URL(appUrl);
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash) {
    console.error('NEXT_PUBLIC_APP_URL must be the public HTTPS origin for this deployment.');
    process.exitCode = 1;
  } else if (process.env.APP_ENV === 'production' && origin.hostname !== 'backsignal.tech') {
    console.error('Production webhook must point to backsignal.tech.');
    process.exitCode = 1;
  } else if (process.env.APP_ENV === 'stage' && origin.hostname !== 'stage.backsignal.tech') {
    console.error('Stage webhook must point to stage.backsignal.tech.');
    process.exitCode = 1;
  } else {
    try {
      const identityResponse = await fetch(`https://api.telegram.org/bot${token}/getMe`, { signal: AbortSignal.timeout(10000) });
      const identity = await identityResponse.json();
      if (!identityResponse.ok || !identity.ok || identity.result?.username?.toLowerCase() !== username.toLowerCase()) {
        console.error('Bot token does not match TELEGRAM_BOT_USERNAME.');
        process.exitCode = 1;
      } else {
        const url = `${origin.origin}/api/telegram/webhook`;
        const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, secret_token: secret, allowed_updates: ['message'] }),
          signal: AbortSignal.timeout(10000),
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) {
          console.error('Telegram rejected webhook registration.');
          process.exitCode = 1;
        } else {
          console.log(`Telegram webhook registered: ${url}`);
        }
      }
    } catch {
      // Fetch errors may include a URL containing the bot token. Never print the exception.
      console.error('Could not contact Telegram Bot API.');
      process.exitCode = 1;
    }
  }
}
