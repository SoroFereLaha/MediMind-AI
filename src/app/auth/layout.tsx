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
  return (
    <div className="min-h-screen bg-background">
      <Providers>
        {children}
      </Providers>
    </div>
  );
}
