import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function getAuthMetadata(
  page: 'Login' | 'Signup' | 'ForgotPassword' | 'ResetPassword',
): Promise<Metadata> {
  const t = await getTranslations(`Meta.Auth.${page}`);
  return { title: t('title'), description: t('description') };
}
