import { timingSafeEqual } from 'node:crypto';
import { processEmailNotifications } from '@/data/email-notifications';
import { processTelegramNotifications } from '@/data/telegram-notifications';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Response.json({ error: 'Not configured' }, { status: 503 });
  const actual = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from(`Bearer ${secret}`);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const [email, telegram] = await Promise.all([processEmailNotifications(), processTelegramNotifications()]);
    return Response.json({ email, telegram }, { headers: { 'Cache-Control': 'no-store' } });
  }
  catch { return Response.json({ error: 'Processing failed' }, { status: 500 }); }
}
