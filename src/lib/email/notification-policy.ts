export function notificationOrigin() {
  const origin = new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.APP_ENV === 'production'
        ? 'https://backsignal.tech'
        : 'https://stage.backsignal.tech'),
  );
  if (
    origin.username ||
    origin.password ||
    (origin.protocol !== 'https:' &&
      !(
        origin.protocol === 'http:' &&
        ['localhost', '127.0.0.1'].includes(origin.hostname)
      ))
  )
    throw new Error('Invalid notification origin');
  return origin.origin;
}

export function retryNotification({
  attempts,
  uncertain,
  firstAttemptAt,
  now,
}: {
  attempts: number;
  uncertain: boolean;
  firstAttemptAt: Date | null;
  now: Date;
}) {
  // Provider deduplication lasts 24 hours. Never blindly resend an ambiguous request after that window.
  if (
    attempts >= 5 ||
    (uncertain &&
      firstAttemptAt &&
      now.getTime() - firstAttemptAt.getTime() >= 23 * 60 * 60 * 1000)
  )
    return false;
  return true;
}
