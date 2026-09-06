'use client';

import { useTranslations, useMessages } from 'next-intl';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { site } from '@/config/site';

const photos = [
  { src: '/gallery/princes-garden-1.jpg', alt: 'Prince\'s Garden Photo 1' },
  { src: '/gallery/princes-garden-2.jpg', alt: 'Prince\'s Garden Photo 2' },
  { src: '/gallery/princes-garden-3.jpg', alt: 'Prince\'s Garden Photo 3' },
  { src: '/gallery/princes-garden-4.jpg', alt: 'Prince\'s Garden Photo 4' },
  { src: '/gallery/princes-garden-5.jpg', alt: 'Prince\'s Garden Photo 5' },
  { src: '/gallery/princes-garden-6.jpg', alt: 'Prince\'s Garden Photo 6' },
  { src: '/gallery/princes-garden-7.jpg', alt: 'Prince\'s Garden Photo 7' },
  { src: '/gallery/princes-garden-10.jpg', alt: 'Prince\'s Garden Photo 8' },
  { src: '/gallery/princes-garden-12.jpg', alt: 'Prince\'s Garden Photo 9' },
  { src: '/gallery/princes-garden-13.jpg', alt: 'Prince\'s Garden Photo 10' },
  { src: '/gallery/princes-garden-14.jpg', alt: 'Prince\'s Garden Photo 11' },
  { src: '/gallery/princes-garden-15.jpg', alt: 'Prince\'s Garden Photo 12' },
  { src: '/gallery/princes-garden-16.jpg', alt: 'Prince\'s Garden Photo 13' },
  { src: '/gallery/princes-garden-17.jpg', alt: 'Prince\'s Garden Photo 14' },
];

export default function Gallery() {
  const t = useTranslations('gallery');
  const messages = useMessages() as any;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const captions = (messages?.gallery?.captions || []) as string[];

  const galleryPhotos = photos.map((photo, i) => ({
    ...photo,
    alt: captions[i] || photo.alt,
  }));

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
  }, [galleryPhotos.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
  }, [galleryPhotos.length]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);

  const mapsLink = site.mapsShareUrl;

  return (
    <>
      <section id="gallery" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>{t('subtitle')}</p>
          <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {galleryPhotos.map((photo, i) => (
              <div
                key={i}
                className={`gallery-item relative group cursor-pointer ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
                onClick={() => openLightbox(i)}
                style={{ minHeight: i === 0 ? '400px' : '180px' }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                  className="object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg flex items-end">
                  <p className="text-white text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.alt}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              {t('viewAll')}
            </a>
          </div>
        </div>
      </section>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="relative w-[90vw] h-[85vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={galleryPhotos[currentIndex].src}
              alt={galleryPhotos[currentIndex].alt}
              fill
              className="object-contain rounded-lg"
            />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
            {currentIndex + 1} / {galleryPhotos.length}
          </div>
        </div>
      )}
    </>
  );
}
