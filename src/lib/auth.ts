import 'server-only';

import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import { after } from 'next/server';

import {
  createResetPasswordEmail,
  createVerificationEmail,
} from '@/lib/email/auth-email-templates';
import { sendAuthEmail } from '@/lib/email';
import { getEmailLocale } from '@/lib/email/locale';
import { prisma } from '@/lib/prisma';

const authSecret = process.env.BETTER_AUTH_SECRET;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!authSecret) {
  throw new Error('BETTER_AUTH_SECRET is not set');
}

if (!appUrl) {
  throw new Error('NEXT_PUBLIC_APP_URL is not set');
}

export const auth = betterAuth({
  appName: 'Backsignal',
  baseURL: appUrl,
  secret: authSecret,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  advanced: {
    backgroundTasks: {
      handler: (promise) => after(() => promise),
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }, request) => {
      const message = createVerificationEmail({
        locale: getEmailLocale(request),
        name: user.name,
        url,
      });

      await sendAuthEmail({
        to: user.email,
        ...message,
      });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    resetPasswordTokenExpiresIn: 60 * 60,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }, request) => {
      const message = createResetPasswordEmail({
        locale: getEmailLocale(request),
        name: user.name,
        url,
      });

      await sendAuthEmail({
        to: user.email,
        ...message,
      });
    },
  },
});
