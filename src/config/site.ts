/**
 * 单景点 SEO 实体绑定配置
 * 网站：princesgardensofia.com — Prince's Garden / Княжеска градина (Sofia)
 *
 * 域名统一在此定义（唯一事实来源）。robots / sitemap / canonical /
 * hreflang / Open Graph / JSON-LD / OG 图片等全部自动跟随。
 *
 * 若同一套代码需部署到其他域名，无需改动代码，构建时注入环境变量即可：
 *   NEXT_PUBLIC_SITE_URL=https://example.com   （客户端/服务端均生效，推荐）
 *   或 SITE_DOMAIN=example.com                 （仅服务端构建时生效）
 */
const DEFAULT_ORIGIN = 'https://princesgardensofia.com';

function resolveOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_DOMAIN?.trim() ||
    '';
  if (!raw) return DEFAULT_ORIGIN;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, '');
}

export const siteOrigin = resolveOrigin();

export const site = {
  domain: siteOrigin.replace(/^https?:\/\//, ''),
  url: siteOrigin,

  // ===== 实体名称绑定 =====
  attractionFullName: "Prince's Garden",
  attractionShortName: "Prince's Garden",
  alternateNames: ['Knyazheska gradina', 'Княжеска градина', 'Княжеската градина'],
  officialNameBg: 'Княжеска градина',

  // ===== 地理归属 =====
  city: 'Sofia',
  cityLocal: 'София',
  stateProvince: 'Sofia City Province',
  country: 'Bulgaria',
  countryCode: 'BG',
  postalCode: '1000',
  streetAddress: 'Evlogi i Hristo Georgiev Blvd 99А',
  plusCode: 'M8RM+3G',

  // ===== 联系方式（NAP 一致性）=====
  telephone: '+35924918344',
  telephoneDisplay: '+359 2 491 8344',

  // ===== 坐标 =====
  geo: {
    latitude: 42.690128,
    longitude: 23.3337855,
  },

  // ===== 地图 =====
  mapsShareUrl: 'https://maps.app.goo.gl/hy2Jmwz8QuZS41Sd8',
  mapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4013.2898467345162!2d23.333785499999998!3d42.690128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa85757366f767%3A0x18a003962757979b!2sPrince's%20Garden!5e1!3m2!1sen!2s!4v1788627911115!5m2!1sen!2s",

  // ===== 周边核心地标 =====
  nearbyLandmark1: 'Sofia University St. Kliment Ohridski',
  nearbyLandmark2: 'Alexander Nevsky Cathedral',

  // ===== 官方/权威链接 =====
  govtTourismUrl: 'http://visitsofia.bg/',
  ministryTourismUrl: 'https://www.tourism.government.bg/',
  ministryCultureUrl: 'https://mc.government.bg/',
  sofiaMunicipalityUrl: 'https://www.sofia.bg/en',
  ninknUrl: 'http://ninkn.bg/',

  // ===== 媒体 =====
  heroImagePath: '/gallery/princes-garden-1.jpg',
  heroImageUrl: `${siteOrigin}/gallery/princes-garden-1.jpg`,

  // ===== GA4 =====
  ga4Id: 'G-HXM22WWPKP',
};

export const heroImageAlt = "Prince's Garden - Main view in Sofia, Bulgaria";
