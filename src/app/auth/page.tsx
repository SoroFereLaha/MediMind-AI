'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirection vers la page de choix
    router.push('/choice');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenue</h1>
        <p className="text-muted-foreground mb-6">
          Redirection vers la page de choix...
        </p>
      </div>
    </div>
  );
}
