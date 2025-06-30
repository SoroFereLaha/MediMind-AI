import { Metadata } from 'next';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  title: 'Authentification - MediMind AI',
  description: 'Page d\'authentification de MediMind AI',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bodyFontClass = 'font-body';

  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${bodyFontClass} antialiased bg-background text-foreground`}>
        <Providers>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
