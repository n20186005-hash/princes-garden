import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

// This page only renders when the app is built statically (output: 'export')
// For dynamic deployments, the middleware will intercept requests to `/`
// and redirect to the default locale (e.g. `/bg`).
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}