import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prince's Garden (Sofia) – Visitor Guide & Location",
    short_name: "Prince's Garden",
    description:
      'Visitor guide to Prince\'s Garden (Княжеска градина) in Sofia, Bulgaria. Location, map, landmarks, history and travel tips.',
    start_url: '/bg',
    scope: '/',
    lang: 'bg',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#234830',
    orientation: 'portrait-primary',
    categories: ['travel', 'tourism'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
