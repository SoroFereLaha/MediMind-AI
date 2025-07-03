
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { Providers } from '@/components/providers';

console.log('[LocaleLayout] Root module evaluated (internationalization disabled)');


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "MediMind IA",
    description: "Guidance médicale assistée par IA pour votre bien-être.",
  };
}


export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <Providers>
      <AppLayout>{children}</AppLayout>
    </Providers>
  );
}
