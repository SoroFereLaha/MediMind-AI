
import type { Metadata } from 'next';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
// import { NextIntlClientProvider } from 'next-intl'; // Removed
// import { getMessages } from 'next-intl/server'; // Removed
// import { getTranslations } from 'next-intl/server'; // Removed
// import { locales } from '@/i18n'; // Temporarily remove to see if it affects anything - Already removed

// Top-level log for module evaluation
console.log('[LocaleLayout] Root module evaluated (internationalization disabled)');

// Temporarily remove generateStaticParams
// export function generateStaticParams() {
//   console.log('[LocaleLayout] generateStaticParams called (internationalization disabled)');
//   return locales.map((l) => ({locale: l}));
// }

export async function generateMetadata(
  // { params: routeParams }: { params: { locale: string } } // Old signature
): Promise<Metadata> {
  // await Promise.resolve(); // Removed, as we are simplifying params handling too
  // const locale = routeParams.locale; // Old way
  // console.log(`[${locale}/layout.tsx generateMetadata] Top of generateMetadata. Locale from routeParams: "${locale}" (type: ${typeof locale}) (i18n disabled)`);
  
  // Hardcoded metadata as next-intl is disabled
  return {
    title: "MediMind AI (i18n Disabled)",
    description: "AI-Powered Medical Guidance (i18n Disabled)",
  };
}


export default async function LocaleLayout({
  children,
  params: routeParams // Keep params for folder structure, but don't use for i18n
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // await Promise.resolve(); // Removed
  const locale = routeParams.locale;
  console.log(`[${locale}/layout.tsx LocaleLayout] Top of LocaleLayout. Locale from routeParams: "${locale}" (type: ${typeof locale}) (i18n disabled)`);

  // No longer fetching messages
  // let messages;
  // try {
  //   console.log(`[${locale}/layout.tsx LocaleLayout] Attempting to get messages with locale value: "${locale}" (type: ${typeof locale})`);
  //   messages = await getMessages({ locale }); 
  //   console.log(`[${locale}/layout.tsx LocaleLayout] Successfully got messages for locale: ${locale}`, messages && messages.Layout ? (messages.Layout as any).title : 'Messages Undefined or Layout missing');
  // } catch (error: any) {
  //   console.error(`[${locale}/layout.tsx LocaleLayout] CATCH_ERROR getMessages for locale ${locale}:`, error.message, error.digest ? error.digest : 'N/A', error.stack ? error.stack : 'N/A');
  //   messages = { /* Fallback messages removed as provider is removed */ };
  // }

  return (
    // <NextIntlClientProvider locale={locale} messages={messages}> // Removed
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </ThemeProvider>
    // </NextIntlClientProvider> // Removed
  );
}
