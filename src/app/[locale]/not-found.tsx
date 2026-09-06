import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default async function LocaleNotFoundPage({
  params,
}: {
  params?: Promise<{ locale?: string }>;
}) {
  // Next.js 预渲染段级 404 兜底时可能不传 params，这里做安全兜底
  let locale: string = routing.defaultLocale;
  try {
    const resolved = params ? await params : {};
    if (resolved.locale && routing.locales.includes(resolved.locale as never)) {
      locale = resolved.locale;
    }
  } catch {
    // 保持默认语言
  }

  setRequestLocale(locale);
  const t = await getTranslations('notFound');
  const ht = await getTranslations('header');

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center max-w-lg">
        <p
          className="font-display text-7xl sm:text-8xl font-bold mb-6"
          style={{ color: 'var(--accent)' }}
        >
          404
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>
          {t('text')}
        </p>
        <a
          href={`/${locale}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          {ht('backToHome')}
        </a>
      </div>
    </div>
  );
}
