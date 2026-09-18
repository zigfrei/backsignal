import 'server-only';

import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import type { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

const windowMs = 10 * 60 * 1000;

export function getClientFingerprint(requestHeaders: Headers) {
  const secret =
    process.env.PUBLIC_RATE_LIMIT_SECRET || process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error('Rate limit secret is missing');
  // Only Vercel's overwritten header is trusted. Local dev never trusts client headers.
  const ip =
    process.env.VERCEL === '1'
      ? requestHeaders.get('x-forwarded-for')?.split(',')[0].trim()
      : process.env.NODE_ENV === 'development'
        ? '127.0.0.1'
        : undefined;
  if (!ip || !isIP(ip)) throw new Error('Trusted client IP is unavailable');
  const normalized =
    ip.startsWith('::ffff:') && isIP(ip.slice(7)) === 4
      ? ip.slice(7)
      : ip.toLowerCase();
  return createHmac('sha256', secret).update(normalized).digest('hex');
}

export async function consumePublicLimit(
  tx: Prisma.TransactionClient,
  scope: string,
  fingerprint: string,
  limit: number,
) {
  const now = Date.now();
  const window = Math.floor(now / windowMs);
  const expiresAt = new Date((window + 1) * windowMs);
  const key = `${scope}:${fingerprint}:${window}`;
  const rows = await tx.$queryRaw<{ count: number }[]>`
    INSERT INTO public_rate_limits (key, count, "expiresAt") VALUES (${key}, 1, ${expiresAt})
    ON CONFLICT (key) DO UPDATE SET count = public_rate_limits.count + 1
    WHERE public_rate_limits.count < ${limit}
    RETURNING count`;
  return {
    allowed: rows.length > 0,
    retryAfter: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
  };
}

export async function consumeAttemptLimit(fingerprint: string) {
  const result = await prisma.$transaction((tx) =>
    consumePublicLimit(tx, 'attempt', fingerprint, 30),
  );
  // Opportunistic bounded cleanup keeps expired identifiers from accumulating.
  if (Math.random() < 0.05) {
    await prisma.$executeRaw`DELETE FROM public_rate_limits WHERE key IN (SELECT key FROM public_rate_limits WHERE "expiresAt" < NOW() LIMIT 200)`;
  }
  return result;
}
