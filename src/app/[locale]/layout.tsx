
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';

console.log('[LocaleLayout] Root module evaluated (internationalization disabled)');


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "MediMind IA",
    description: "Guidance médicale assistée par IA pour votre bien-être.",
  };
}


export default async function LocaleLayout({
  children,
  params: routeParams 
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const locale = routeParams.locale;
  console.log(`[${locale}/layout.tsx LocaleLayout] Top of LocaleLayout. Locale from routeParams: "${locale}" (type: ${typeof locale}) (i18n disabled)`);

  return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </ThemeProvider>
  );
}
