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
  user: {
    additionalFields: {
      preferredLocale: { type: 'string', required: false, defaultValue: 'ru', input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => ({
          data: { ...user, preferredLocale: getEmailLocale(context?.request) },
        }),
      },
    },
  },
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
    // OAuth signup (Yandex reports emailVerified=false) dispatches verification.
    // Password signup still uses the form's explicit sendVerificationEmail call
    // for both new/existing addresses, without sending two emails to new users.
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60,
    sendVerificationEmail: async ({ user, url }, request) => {
      if (request && new URL(request.url).pathname.endsWith('/sign-up/email')) return;
      const recipient = await prisma.user.findUniqueOrThrow({
        where: { id: user.id },
        select: {
          preferredLocale: true,
          accounts: { where: { providerId: 'yandex' }, select: { id: true }, take: 1 },
        },
      });
      const message = createVerificationEmail({
        locale: recipient.preferredLocale === 'en' ? 'en' : 'ru',
        name: user.name,
        url,
        notificationOnly: recipient.accounts.length > 0,
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
    sendResetPassword: async ({ user, url }) => {
      const recipient = await prisma.user.findUniqueOrThrow({
        where: { id: user.id }, select: { preferredLocale: true },
      });
      const message = createResetPasswordEmail({
        locale: recipient.preferredLocale === 'en' ? 'en' : 'ru',
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
