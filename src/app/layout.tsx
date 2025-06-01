
import type { Metadata } from 'next';
import './globals.css'; // Global styles
import { defaultLocale, locales } from '@/i18n'; // Import defaultLocale and locales

export const metadata: Metadata = {
  title: {
    template: '%s | MediMind AI',
    default: 'MediMind AI',
  },
  description: 'AI-Powered Medical Guidance for your well-being.',
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: { locale: string }; // Ensure locale is expected as string
}

export default function RootLayout({
  children,
  params
}: RootLayoutProps) {
  // Ensure currentLocale is always a valid, defined locale string
  const currentLocale = locales.includes(params.locale) ? params.locale : defaultLocale;
  const dir = currentLocale === 'ar' ? 'rtl' : 'ltr';
  const bodyFontClass = currentLocale === 'ar' ? 'font-arabic' : 'font-body';

  return (
    <html lang={currentLocale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        {currentLocale === 'ar' && (
          <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />
        )}
      </head>
      <body className={`${bodyFontClass} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
