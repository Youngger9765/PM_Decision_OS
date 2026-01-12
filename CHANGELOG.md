# Changelog

All notable changes to Decision OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Internationalization (i18n)** - Full bilingual support for Traditional Chinese (zh-TW) and English (en)
  - Implemented using next-intl v4.7.0 for Next.js 14 App Router
  - Locale-aware routing with `[locale]` dynamic segments
  - Language switcher component in all pages
  - Default locale: Traditional Chinese (zh-TW)
  - Supported locales: Traditional Chinese (zh-TW), English (en)
  - Comprehensive translation files with 300+ translation keys
  - All 6 pages fully translated:
    - Landing page
    - Auth login page
    - Dashboard page
    - Learning Repository page
    - New Cycle form page
    - Cycle detail page
  - Middleware for automatic locale detection and redirection
  - Type-safe translation keys with TypeScript

### Changed
- Restructured app directory to support locale-based routing (`app/[locale]/...`)
- Updated all navigation links to include locale prefix (`/${locale}/...`)
- Modified all pages to use translation hooks (`useTranslations`, `useLocale`)

### Technical Implementation
- **next-intl Configuration**: `i18n.ts` with locale validation and fallback logic
- **Middleware**: `middleware.ts` with `localePrefix: 'always'` for explicit locale URLs
- **Translation Files**: `messages/zh-TW.json`, `messages/en.json`
- **Components**: `LanguageSwitcher.tsx` for locale switching
- **Layout**: `app/[locale]/layout.tsx` with NextIntlClientProvider

### Files Modified
- `next.config.js` - Added next-intl plugin configuration
- `package.json` - Added next-intl@4.7.0 dependency
- `i18n.ts` - Created i18n configuration with locale validation
- `middleware.ts` - Created locale detection middleware
- `app/[locale]/layout.tsx` - Created locale-specific layout
- `app/[locale]/page.tsx` - Translated landing page
- `app/[locale]/auth/login/page.tsx` - Translated login page
- `app/[locale]/app/page.tsx` - Translated dashboard
- `app/[locale]/app/learning/page.tsx` - Translated learning repository
- `app/[locale]/app/cycles/new/page.tsx` - Translated new cycle form
- `app/[locale]/app/cycles/[id]/page.tsx` - Translated cycle detail page
- `components/LanguageSwitcher.tsx` - Created language switcher component
- `lib/mock-data.ts` - Added TypeScript interface for type safety

### Fixes
- Fixed i18n runtime configuration to properly return locale from `getRequestConfig`
- Fixed locale parameter undefined error by explicitly passing locale to `getMessages()`
- Added locale prop to `NextIntlClientProvider` for proper client-side hydration

---

## [0.1.0] - 2026-01-11

### Added
- Initial project setup with Next.js 14, TypeScript, TailwindCSS
- Landing page with editorial design aesthetic
- Dashboard page with North Star metrics
- Learning Repository page
- Decision Cycle detail page
- Mock data for demonstration
- Responsive design for mobile and desktop

### Technical Stack
- Next.js 14.1.0 (App Router)
- TypeScript 5.3.3
- TailwindCSS 3.4.1
- React 18

---

**Note**: This project is in active development. Features marked as [Unreleased] will be included in the next version release.
