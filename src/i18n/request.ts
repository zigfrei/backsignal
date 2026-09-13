import * as rootParams from 'next/root-params';
import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from './routing';

const messageLoaders = {
  ru: () => import('../../messages/ru.json'),
  en: () => import('../../messages/en.json'),
};

export default getRequestConfig(async ({ locale: localeOverride }) => {
  const locale = localeOverride ?? (await rootParams.locale());

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await messageLoaders[locale]()).default,
  };
});
