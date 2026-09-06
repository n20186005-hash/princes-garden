import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';
import { site, heroImageAlt } from '@/config/site';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const ogLocaleMap: Record<string, string> = {
  zh: 'zh_CN',
  en: 'en_US',
  bg: 'bg_BG',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = site.url;
  const selfUrl = `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),
    manifest: '/manifest.webmanifest',
    icons: {
      icon: [
        { url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/icons/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: '/icons/icon-192.png', type: 'image/png', sizes: '192x192' }],
    },
    applicationName: `${site.attractionShortName} ${site.city}`,
    alternates: {
      canonical: selfUrl,
    },
    title: messages.meta.title,
    description: messages.meta.description,
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      siteName: `${site.attractionFullName}, ${site.city}`,
      locale: ogLocaleMap[locale] ?? 'en_US',
      type: 'website',
      images: [
        {
          url: site.heroImageUrl,
          alt: heroImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.meta.title,
      description: messages.meta.description,
      images: [site.heroImageUrl],
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#234830',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : locale === 'bg' ? 'bg-BG' : 'en'} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#234830" />
        <meta name="application-name" content={`${site.attractionShortName} ${site.city}`} />
        <meta name="apple-mobile-web-app-title" content={site.attractionShortName} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* Google Analytics 4 — 默认拒绝 + 同意后加载（Consent Mode v2） */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var GA4_ID = ${JSON.stringify(site.ga4Id)};
                function readAnalytics() {
                  try {
                    var p = JSON.parse(localStorage.getItem('cookiePrefs') || '{}');
                    return !!(p && p.analytics);
                  } catch (e) { return false; }
                }
                var allowed = readAnalytics();
                window.dataLayer = window.dataLayer || [];
                function gtag() { window.dataLayer.push(arguments); }
                window.gtag = gtag;
                window.__gtagLoaded = false;
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: allowed ? 'granted' : 'denied',
                  wait_for_update: 500
                });
                function applyConsent() {
                  var ok = readAnalytics();
                  if (ok && !window.__gtagLoaded) {
                    window.__gtagLoaded = true;
                    var s = document.createElement('script');
                    s.async = true;
                    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
                    document.head.appendChild(s);
                    gtag('js', new Date());
                    gtag('config', GA4_ID, { anonymize_ip: true });
                  }
                  gtag('consent', 'update', {
                    analytics_storage: ok ? 'granted' : 'denied'
                  });
                }
                window.__applyConsent = applyConsent;
                window.addEventListener('analytics-consent-changed', applyConsent);
                if (allowed) applyConsent();
              })();
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        {/* PWA: register service worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function () {
                  navigator.serviceWorker.register('/sw.js').catch(function (err) {
                    console.warn('Service worker registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
