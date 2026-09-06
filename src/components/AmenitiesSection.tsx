import { useTranslations, useMessages } from 'next-intl';
import type { ReactNode } from 'react';

/**
 * 便民配套板块：围绕“游客到了以后具体怎么办”提供类型级建议，
 * 不推荐任何具体商户/品牌，保持中立客观。
 */
const ICONS: Record<string, ReactNode> = {
  restroom: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="6" r="2.5" />
      <circle cx="15" cy="6" r="2.5" />
      <path d="M4 20c0-3 2.2-5 5-5s5 2 5 5" />
      <path d="M15 15.5c3.2-.7 5.5 1 6 4.5" />
    </svg>
  ),
  water: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" />
    </svg>
  ),
  parking: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  dining: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 2v6a2 2 0 0 0 4 0V2" />
      <path d="M9 2v20" />
      <path d="M18 2v20M18 2c-3 0-3 4-3 7v6" />
      <path d="M15 2v10a3 3 0 0 0 3 0V2" />
    </svg>
  ),
  supermarket: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" />
      <path d="M7 9V6a5 5 0 0 1 10 0v3" />
    </svg>
  ),
  pharmacy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 4h6v4l2.5 2.5a5.5 5.5 0 1 1-7.8 7.8L8 15.5 9 14.5l1 1 1.5-1.5 1.8 1.8a3.5 3.5 0 1 0-4.9-4.9L6.5 13 4 15.5 2.5 14 5.5 11 4 9.5 5.5 8l1 1L9 6.5 9 4z" />
      <path d="M9 4V2h6v2" />
    </svg>
  ),
  hotel: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 21V4h2v14h16V6h-8v9H6" />
      <path d="M15 6V4h2v2M13 10h6M13 14h6" />
      <circle cx="10" cy="8" r="1" />
    </svg>
  ),
  charging: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v18M4 6h8M6 3v3M10 3v3" />
      <path d="M4 21h8M8 9l2 3h-3l2 4" opacity="0.4" />
      <path d="M16 3v6M19 3l-3 3M16 6l3-3" opacity="0.4" />
    </svg>
  ),
};

const FALLBACK_ICON = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

export default function AmenitiesSection() {
  const t = useTranslations('amenities');
  const messages = useMessages() as any;
  const cards = (messages?.amenities?.cards || []) as Array<{
    id: string;
    title: string;
    text: string;
  }>;

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="text-sm mb-8 max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-xl p-5 flex gap-4"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: 'var(--accent)', color: 'white' }}
              >
                {ICONS[card.id] ?? FALLBACK_ICON}
              </div>
              <div>
                <h3 className="font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                  {card.title}
                </h3>
                <p
                  className="text-sm leading-relaxed whitespace-pre-line"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 rounded-xl p-4 text-sm leading-relaxed"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--accent)' }}
        >
          <p style={{ color: 'var(--text-secondary)' }}>{t('note')}</p>
        </div>
      </div>
    </section>
  );
}
