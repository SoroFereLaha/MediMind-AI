
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { redirect } from 'next/navigation';
import { Providers } from '@/components/providers';

console.log('[LocaleLayout] Root module evaluated (internationalization disabled)');


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "MediMind IA",
    description: "Guidance médicale assistée par IA pour votre bien-être.",
  };
}


export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const { locale } = await params as { locale: string };
  // Redirect any stray patient path to root
  if (locale === 'patient') {
    redirect('/');
  }
  console.log(`[${locale}/layout.tsx LocaleLayout] Top of LocaleLayout. Locale from routeParams: "${locale}" (type: ${typeof locale}) (i18n disabled)`);

  return (
      <Providers>
        <AppLayout>{children}</AppLayout>
      </Providers>
  );
}
