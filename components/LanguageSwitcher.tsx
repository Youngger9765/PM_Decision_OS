"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    startTransition(() => {
      // Replace the locale in the pathname
      const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.replace(newPathname);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => switchLocale('zh-TW')}
        disabled={isPending}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          locale === 'zh-TW'
            ? 'bg-purple-600 text-white font-semibold'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
      >
        繁體中文
      </button>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`px-3 py-1 text-sm rounded transition-colors ${
          locale === 'en'
            ? 'bg-purple-600 text-white font-semibold'
            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
        }`}
      >
        English
      </button>
    </div>
  );
}
