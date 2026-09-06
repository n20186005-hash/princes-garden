import { useMessages, useLocale } from 'next-intl';
import { site } from '@/config/site';

/**
 * SEO 结构化数据（JSON-LD）
 * - TouristAttraction + Park：为搜索引擎锚定“公园/景点”双重实体
 *   （含双语名称、地址、电话 NAP、地理坐标与地图链接）
 * - WebSite：站点级实体，声明多语言 inLanguage
 * - FAQPage：与页面可见 FAQ 同步，利于富摘要
 * 所有文本随当前语言本地化（url 指向当前语言版本，避免跨语言串台）。
 */
export default function SeoJsonLd() {
  const messages = useMessages() as any;
  const locale = useLocale();
  const faqItems = (messages?.faq?.items || []) as Array<{
    question: string;
    answer: string;
  }>;
  const metaTitle = (messages?.meta?.title as string) || site.attractionFullName;
  const metaDescription =
    (messages?.meta?.description as string) || `${site.attractionFullName}, ${site.city}`;
  const localeUrl = `${site.url}/${locale}`;

  const address = {
    '@type': 'PostalAddress',
    streetAddress: site.streetAddress,
    addressLocality: site.city,
    addressRegion: site.stateProvince,
    postalCode: site.postalCode,
    addressCountry: site.countryCode,
  };

  const geo = {
    '@type': 'GeoCoordinates',
    latitude: site.geo.latitude,
    longitude: site.geo.longitude,
  };

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['TouristAttraction', 'Park'],
        '@id': `${site.url}/#attraction`,
        name: site.attractionFullName,
        alternateName: Array.from(
          new Set([
            ...site.alternateNames,
            'Княжеската градина',
            'Knyazheskata gradina',
            'Княжеската градина София',
          ])
        ),
        description: metaDescription,
        url: localeUrl,
        image: [site.heroImageUrl],
        isAccessibleForFree: true,
        telephone: site.telephone,
        address,
        geo,
        hasMap: site.mapsShareUrl,
        sameAs: [
          site.mapsShareUrl,
          site.govtTourismUrl,
          site.ministryTourismUrl,
          site.ministryCultureUrl,
        ],
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '00:00',
          closes: '23:59',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: metaTitle,
        description: metaDescription,
        inLanguage: ['bg', 'en', 'zh'],
        publisher: {
          '@type': 'Organization',
          '@id': `${site.url}/#organization`,
          name: `${site.attractionFullName}, ${site.city}`,
          url: site.url,
          telephone: site.telephone,
          address,
        },
      },
    ],
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
