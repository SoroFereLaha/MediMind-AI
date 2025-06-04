
import type { Metadata } from 'next';
import './globals.css'; // Global styles
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: {
    template: '%s | MediMind IA',
    default: 'MediMind IA',
  },
  description: 'Guidance médicale assistée par IA pour votre bien-être.',
  icons: {
    icon: '/favicon.ico', // Chemin vers votre favicon.ico dans le dossier public
    // Vous pouvez aussi spécifier d'autres types/tailles :
    // icon: '/icon.png', // Pour un favicon PNG
    // apple: '/apple-icon.png', // Pour les appareils Apple
    // shortcut: '/shortcut-icon.png'
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children
}: RootLayoutProps) {
  const bodyFontClass = 'font-body'; // PT Sans par défaut

  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${bodyFontClass} antialiased bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
