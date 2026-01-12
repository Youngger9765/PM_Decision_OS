import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'zh-TW'] as const;
export const defaultLocale = 'zh-TW' as const;

export default getRequestConfig(async ({ locale }) => {
  // Validate locale or use fallback
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

  return {
    locale: validLocale as string,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
});
