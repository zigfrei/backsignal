import 'server-only';

import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';
import {
  genericOAuth,
  yandex,
} from 'better-auth/plugins/generic-oauth';
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
const yandexClientId = process.env.YANDEX_CLIENT_ID;
const yandexClientSecret = process.env.YANDEX_CLIENT_SECRET;

if (!authSecret) {
  throw new Error('BETTER_AUTH_SECRET is not set');
}

if (!appUrl) {
  throw new Error('NEXT_PUBLIC_APP_URL is not set');
}

if (!yandexClientId || !yandexClientSecret) {
  throw new Error('YANDEX_CLIENT_ID and YANDEX_CLIENT_SECRET must be set');
}

export const auth = betterAuth({
  appName: 'Backsignal',
  baseURL: appUrl,
  secret: authSecret,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['yandex'],
      requireLocalEmailVerified: true,
      allowDifferentEmails: false,
      allowUnlinkingAll: false,
      updateUserInfoOnLink: false,
    },
  },
  advanced: {
    backgroundTasks: {
      handler: (promise) => after(() => promise),
    },
  },
  emailVerification: {
    // Signup returns a generic success response for an existing email and does
    // not resend verification automatically. The signup form explicitly calls
    // sendVerificationEmail after success so new and existing unverified users
    // follow the same non-enumerating flow and receive exactly one email.
    sendOnSignUp: false,
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
  plugins: [
    genericOAuth({
      config: [
        yandex({
          clientId: yandexClientId,
          clientSecret: yandexClientSecret,
        }),
      ],
    }),
  ],
});
