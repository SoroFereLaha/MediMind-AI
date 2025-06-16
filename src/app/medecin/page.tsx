
import { PageHeader } from '@/components/page-header';
import { LayoutDashboard, Users, FilePlus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function MedecinDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tableau de Bord Médecin"
        description="Bienvenue dans votre espace professionnel MediMind IA."
        icon={LayoutDashboard}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Users className="h-6 w-6" />
              Gérer les Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Consultez la liste de vos patients, recherchez des fiches spécifiques et accédez à leurs historiques de suivi.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/medecin/patients">Voir Mes Patients</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <FilePlus className="h-6 w-6" />
              Nouvelle Fiche de Suivi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription>
              Créez une nouvelle fiche de suivi pour un patient existant ou enregistrez un nouveau patient dans le système.
            </CardDescription>
            <Button asChild className="w-full">
              <Link href="/medecin/patients/nouveau">Ajouter une Fiche</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow bg-accent/20 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent-foreground">
              {/* Placeholder for future feature */}
              Statistiques (À venir)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Visualisez des statistiques clés concernant votre activité et vos patients. (Fonctionnalité future)
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <section className="mt-12 p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Accès Rapides</h2>
        <ul className="list-disc list-inside space-y-2 text-primary">
          <li><Link href="/medecin/patients" className="hover:underline">Consulter la liste des patients</Link></li>
          <li><Link href="/medecin/patients/nouveau" className="hover:underline">Créer une nouvelle fiche de suivi</Link></li>
          {/* Add more quick links as needed */}
        </ul>
      </section>
    </div>
  );
}
