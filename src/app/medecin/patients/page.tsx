
'use client';

import { useState, useMemo, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Users, Search, FileText, UserPlus, Loader2 } from 'lucide-react';
import { useAppContext, type PatientRecordServerResponse } from '@/contexts/app-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function PatientListItem({ patient }: { patient: PatientRecordServerResponse }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{patient.patientFirstName} {patient.patientLastName}</CardTitle>
        <CardDescription>
          {patient.disease} - {new Date(patient.patientDOB).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })} ({patient.patientSex})
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">Fiche créée le: {new Date(patient.createdAt).toLocaleDateString('fr-FR')}</p>
        <Button asChild variant="outline" size="sm">
          <Link href={`/medecin/patients/${patient.id}`}>
            <FileText className="mr-2 h-4 w-4" />
            Voir Fiche
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function ListePatientsPage() {
  const { getPatientRecords } = useAppContext();
  const [patientRecords, setPatientRecords] = useState<PatientRecordServerResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // TODO: Si l'API getPatientRecords nécessite l'ID du médecin,
        // assurez-vous de le passer ici (par exemple, depuis un contexte d'utilisateur authentifié).
        const records = await getPatientRecords();
        setPatientRecords(records);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur lors de la récupération des fiches patients.");
        setPatientRecords([]); // Vider en cas d'erreur
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [getPatientRecords]);

  const filteredPatients = useMemo(() => {
    if (!searchTerm) {
      return patientRecords;
    }
    return patientRecords.filter(
      (patient) =>
        patient.patientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patientLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.disease.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patientRecords, searchTerm]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Liste des Patients"
        description="Consultez et recherchez parmi les fiches de suivi de vos patients (données via API)."
        icon={Users}
      />

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par nom, prénom, maladie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/medecin/patients/nouveau">
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter Patient / Fiche
          </Link>
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">Chargement des fiches patients...</p>
        </div>
      )}

      {!isLoading && error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur de Chargement</AlertTitle>
          <AlertDescription>{error} Veuillez vérifier votre connexion au backend ou réessayez plus tard.</AlertDescription>
        </Alert>
      )}

      {!isLoading && !error && patientRecords.length === 0 && (
         <Card className="text-center py-10">
           <CardContent className="space-y-3">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Aucune fiche patient trouvée.</h3>
            <p className="text-muted-foreground">Commencez par ajouter une nouvelle fiche de suivi ou vérifiez votre backend.</p>
            <Button asChild className="mt-4">
              <Link href="/medecin/patients/nouveau">
                <UserPlus className="mr-2 h-4 w-4" /> Créer une Fiche
              </Link>
            </Button>
           </CardContent>
         </Card>
      )}

      {!isLoading && !error && patientRecords.length > 0 && filteredPatients.length === 0 && searchTerm && (
        <Card className="text-center py-10">
          <CardContent className="space-y-3">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Aucun patient trouvé pour "{searchTerm}".</h3>
            <p className="text-muted-foreground">Vérifiez votre recherche ou essayez d'autres termes.</p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !error && filteredPatients.length > 0 && (
        <ScrollArea className="h-[calc(100vh-22rem)]"> {/* Adjust height as needed */}
          <div className="space-y-4 pr-4">
            {filteredPatients.map((patient) => (
              <PatientListItem key={patient.id} patient={patient} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
