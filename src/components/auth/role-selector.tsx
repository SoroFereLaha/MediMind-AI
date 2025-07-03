
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext, UserRole } from "@/contexts/app-context";
import { useRouter } from "next/navigation";
import { User, Stethoscope } from "lucide-react";

export function RoleSelector() {
  const { setUserRole } = useAppContext();
  const router = useRouter();

  const handleSelectRole = (role: UserRole) => {
    if (role) {
      setUserRole(role);
      // Persist role in cookie for 1 day
      document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24}`;
      // Navigate to the correct dashboard
      router.replace(role === 'medecin' ? '/medecin' : '/');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
            <Stethoscope className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">Bienvenue sur MediMind IA</CardTitle>
          <CardDescription className="text-lg text-muted-foreground pt-2">
            Veuillez sélectionner votre rôle pour continuer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <Button
            onClick={() => handleSelectRole('patient')}
            className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-shadow"
            variant="outline"
          >
            <User className="mr-3 h-6 w-6" />
            Je suis un Patient
          </Button>
          <Button
            onClick={() => handleSelectRole('medecin')}
            className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <Stethoscope className="mr-3 h-6 w-6" />
            Je suis un Médecin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
