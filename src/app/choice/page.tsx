
'use client';

import Link from 'next/link';
import { RoleSelector } from '@/components/auth/role-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/**
 * Page de sélection du rôle avec accès rapide aux pages d'authentification.
 * Cette page est la destination par défaut du middleware lorsqu'aucun rôle n'est détecté.
 */
export default function ChoicePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <RoleSelector />

      {/* Liens vers connexion / inscription */}
      <Card className="mt-8 w-full max-w-md shadow-md">
        <CardContent className="p-6 flex flex-col space-y-4 items-center">
          <Separator orientation="horizontal" className="w-full" />
          <p className="text-muted-foreground text-sm">Vous avez déjà un compte ?</p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <p className="text-muted-foreground text-sm">Nouveau sur MediMind&nbsp;IA&nbsp;?</p>
          <Button asChild className="w-full">
            <Link href="/auth/register">Créer un compte</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
