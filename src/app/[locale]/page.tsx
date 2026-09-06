import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Intro from '@/components/Intro';
import BasicInfo from '@/components/BasicInfo';
import WeatherSection from '@/components/WeatherSection';
import HoursSection from '@/components/HoursSection';
import WinterSection from '@/components/WinterSection';
import TicketsSection from '@/components/TicketsSection';
import TransportSection from '@/components/TransportSection';
import AmenitiesSection from '@/components/AmenitiesSection';
import InfoSection from '@/components/InfoSection';
import LandmarksSection from '@/components/LandmarksSection';
import Gallery from '@/components/Gallery';
import Reviews from '@/components/Reviews';
import FAQSection from '@/components/FAQSection';
import SourcesSection from '@/components/SourcesSection';
import MapEmbed from '@/components/MapEmbed';
import Footer from '@/components/Footer';
import SeoJsonLd from '@/components/SeoJsonLd';
import { site } from '@/config/site';
import { fetchWeather } from '@/lib/weather';

/** 天气数据缓存周期（秒）：与 Open-Meteo 更新节奏匹配 */
export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = site.url;
  const selfUrl = `${baseUrl}/${locale}`;
  return {
    alternates: {
      canonical: selfUrl,
      languages: {
        'zh': `${baseUrl}/zh`,
        'en': `${baseUrl}/en`,
        'bg': `${baseUrl}/bg`,
        'x-default': `${baseUrl}/bg`,
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const weather = await fetchWeather();

  return (
    <>
      <SeoJsonLd />
      <Header />
      <main>
        <Hero />
        <Intro />
        <BasicInfo />
        <WeatherSection data={weather} />
        <HoursSection />
        <WinterSection />
        <TicketsSection />
        <TransportSection />
        <AmenitiesSection />
        <InfoSection />
        <LandmarksSection />
        <Gallery />
        <Reviews />
        <FAQSection />
        <SourcesSection />
        <MapEmbed />
      </main>
      <Footer />
    </>
  );
}
